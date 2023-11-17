import { useCallback, useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  DragOverlay,
  // PointerSensor,
  MouseSensor,
  TouchSensor,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
  closestCorners,
  pointerWithin,
  // rectIntersection,
  getFirstCollision
  // closestCenter
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { cloneDeep } from 'lodash'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }) {
  //https://docs.dndkit.com/api-documentation/sensors
  // Nếu dùng PointerSensor thì phải  kết hợp thuộc tính CSS touchAction: 'none' ở những phần tử kéo thả nhưng vẫn còn bug
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })

  // Yêu cầu chuột di chuyển 10 pixel trước khi kích hoạt, fix khi click gọi event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

  // Nhấn giữ 250ms và dung sai của cảm ứng 500px thì mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  // Cùng một thời điểm chỉ có một phần tử đang được kéo (card or column)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumn, setOldColumn] = useState(null)

  // Điểm va chạm cuối cùng trước đó (xử lý thuật toán phát hiện va chạm)
  const lastOverId = useRef(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  //  Tìm column theo id của card
  const findColumnByCardId = (cardId) => {
    // Dùng column?.cards thay vì column?.cardOrderIds vì ở bước handleDragOver sẽ làm dữ liệu hoàn chỉnh cho card trước rồi mới tạo ra cardOrderIds mới.
    return orderedColumns.find((column) => column?.cards?.map((card) => card?._id)?.includes(cardId))
  }

  // Update the state again in case a card is moved between two different columns
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns((prevColumns) => {
      // Tìm vị trí của overCard trong column đích (nơi activeCard sắp được thả) trong quá trình kéo.
      const overCardIndex = overColumn?.cards?.findIndex((card) => card._id === overCardId)

      // Logic tính toán "cardIndex mới" lấy từ thư viện
      let newCardIndex
      const isBelowOverItem =
        active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height

      const modifier = isBelowOverItem ? 1 : 0

      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      // Clone mảng OrderedColumnState hiện tại để xử lý dữ liệu và trả về một mảng mới đã được cập nhật
      const nextColoums = cloneDeep(prevColumns)
      const nextActiveColumn = nextColoums.find((column) => column._id === activeColumn._id)
      const nextOverColumn = nextColoums.find((column) => column._id === overColumn._id)

      // Column cũ
      if (nextActiveColumn) {
        // Xóa card khỏi cột hiện tại (active column hoặc cột hiện đang được thao tác) sau khi nó được kéo ra để chuyển sang một cột khác.
        nextActiveColumn.cards = nextActiveColumn.cards.filter((card) => card._id !== activeDraggingCardId)

        // Cập nhật mảng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map((card) => card._id)
      }

      // Column mới
      if (nextOverColumn) {
        // Kiểm tra xem card đang kéo có tồn tại ở overColumn chưa, nếu có thì cần xóa nó trước.
        nextOverColumn.cards = nextOverColumn.cards.filter((card) => card._id !== activeDraggingCardId)

        // Phải cập lại chuẩn dữ liệu columnId trong card sau khi kéo thả giữa hai column khác nhau
        const rebuildActiveDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }

        // Tiếp theo thêm card đang kéo vào overColumn theo vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuildActiveDraggingCardData)

        // Cập nhật mảng cardOrderIds cho chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map((card) => card._id)
      }

      return nextColoums
    })
  }

  // Trigger khi bắt đầu kéo (drag) một phần từ
  const handleDragStart = (event) => {
    // console.log('handleDragStart::', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(
      event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    )
    setActiveDragItemData(event?.active?.data?.current)

    // Nếu là kéo card thì mới thực hiện hành động set giá trị oldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumn(findColumnByCardId(event?.active?.id))
    }
  }

  //Trigger trong quá trình kéo phần tử
  const handleDragOver = (event) => {
    // console.log('handleDragOver', event)

    // Không làm gì thêm nếu đang kéo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // Còn nếu là card thì xử lý thêm để có thể kéo card qua lại giữa các column
    const { active, over } = event

    //Kiểm tra nếu không tồn tại over hoặc active (khi kéo ra khỏi phạm vi container ) thì không làm gì tránh crash trang
    if (!over || !active) return

    // activeDraggingCardId là card đang được kéo
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData }
    } = active

    // overCardId là card đang tương tác với card đang kéo
    const { id: overCardId } = over

    // Tìm 2 columns theo cardIds
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // Nếu không tồn tại 1 trong 2 column thì return tránh crash trang web
    if (!activeColumn || !overColumn) return

    // Khi đang kéo card (handleDragOver), xử lý logic chỉ xảy ra nếu card di chuyển qua lại 2 column khác nhau
    // Ngược lại, không có xử lý nào khi card được kéo trong cùng một column ban đầu.
    // Lưu ý rằng xử lý sau khi kéo xong (handleDragEnd) sẽ được thực hiện trong một hàm khác.
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  // Trigger khi kết thúc hành động kéo (drag) một phần từ => hành động thả (drop)
  const handleDragEnd = (event) => {
    // console.log(event)s
    const { active, over } = event

    //Kiểm tra nếu không tồn tại over hoặc over (khi kéo ra khỏi phạm vi container ) thì không làm gì tránh crash trang
    if (!over || !active) return

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // activeDraggingCardId là card đang được kéo
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData }
      } = active

      // overCardId là card đang tương tác với card đang kéo
      const { id: overCardId } = over

      // Tìm 2 columns theo cardIds
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      // Nếu không tồn tại 1 trong 2 column thì return tránh crash trang web
      if (!activeColumn || !overColumn) return

      // Hành động kéo thả card giữa 2 column khác nhau
      // Phải dùng tới activeDragItemData.columnId hoặc oldColumn._id (set vào state từ trước handleDragStart) chứ không phải activeDrag trong scope handleDragEnd này vì sau khi di qua  onDragOver tới đây là state của card đã được cập nhật lại rồi.
      if (oldColumn._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        // Hành động kéo thả trong cùng mọt colmun

        // Take old position (from oldColumn)
        const oldCardIndex = oldColumn?.cards?.findIndex((c) => c._id === activeDragItemId)
        // Take new position (from overColumn)
        const newCardIndex = overColumn?.cards.findIndex((c) => c._id === overCardId)

        // Dùng arrayMove vì kéo card tương tự như kéo column trong boardContent
        const dndOrderedCards = arrayMove(oldColumn?.cards, oldCardIndex, newCardIndex)
        setOrderedColumns((prevColumns) => {
          // Clone mảng OrderedColumnState hiện tại để xử lý dữ liệu và trả về một mảng mới đã được cập nhật
          const nextColoums = cloneDeep(prevColumns)

          // Tìm tới columns mà đang thả
          const targetColumn = nextColoums.find((column) => column._id === overColumn._id)

          // Cập nhật lại 2 giá trị mới là card và cardOrderIds trong targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map((card) => card._id)

          return nextColoums
        })
      }
    }

    // Xử lý kéo thả Columns trong một boardContent
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      //Nếu vị trí sau khi kéo thả khác với vị trí ban đầu
      if (active.id !== over.id) {
        // Take old position (from active)
        const oldColumnIndex = orderedColumns.findIndex((c) => c._id === active.id)
        // Take new position (from over)
        const newColumnIndex = orderedColumns.findIndex((c) => c._id === over.id)

        // Dùng arrayMove của dndkit để sắp xếp lại mảng Columns  ban đầu
        // https://github.com/clauderic/dnd-kit/blob/master/packages/sortable/src/utilities/arrayMove.ts
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        // const dndOrderedColumnsIds = dndOrderedColumns.map((C) => C._id)

        //Cập nhật lại state column sau khi đã kéo thả
        setOrderedColumns(dndOrderedColumns)
      }
    }

    // Dữ liệu sau khi kéo thả phải đưa về giá trị ban đầu
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumn(null)
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }

  const collisionDetectionStrategy = useCallback(
    (args) => {
      // Trường hợp kéo column dùng closestCorners
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args })
      }

      /// Tìm các điểm giao nhau, va chạm, trả về một mảng các va chạm - intersections với con trỏ
      const pointerIntersections = pointerWithin(args)

      //
      if (!pointerIntersections?.length) return

      // Thuật toán phát hiện va chạm sẽ trả về một mảng các va chạm ở đây
      // const intersections = !!pointerIntersections?.length ? pointerIntersections : rectIntersection(args)

      // Tìm overId đầu tiên trong đám pointerIntersections ở trên
      let overId = getFirstCollision(pointerIntersections, 'id')
      if (overId) {
        // Fix flickering
        // Nếu over nó là column thì sẽ tìm đến cái card gần nhất bên trong khu vực va chạm đó dựa vào thuật toán phát hiện va chạm closestCenter hoặc closestCorners đều được. Recommend dùng closestCorners vì nó mượt hơn.
        const checkColumn = orderedColumns.find((column) => column._id === overId)
        if (checkColumn) {
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => container.id !== overId && checkColumn?.cardOrderIds?.includes(container.id)
            )
          })[0]?.id
        }

        lastOverId.current = overId
        return [{ id: overId }]
      }

      // Nếu overId là null thì trả về mảng rỗng -  tranh bug crash trang
      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeDragItemType, orderedColumns]
  )

  return (
    <DndContext
      sensors={sensors}
      // Thuật toán phát hiện va chạm để fix bug card lớn (có cover) không kéo được
      // https://docs.dndkit.com/api-documentation/context-provider/collision-detection-algorithms#closest-corners
      // Nếu chỉ dùng closestCorners sẽ có bug flickering + sai lệch dữ liệu
      // collisionDetection={closestCorners}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
          width: '100%',
          height: (theme) => theme.trello.boardContentHeight,
          p: '10px 0'
        }}
      >
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && <Column column={activeDragItemData} />}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
