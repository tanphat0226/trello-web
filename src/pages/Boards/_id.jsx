//Board details
import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mapOrder } from '~/utils/sorts'
// import { mockData } from '~/apis/mock-data'
import {
  createNewCardAPI,
  createNewColumnAPI,
  deleteColumnDetailsAPI,
  fetchBoardDetailsAPI,
  moveCardToDifferentColumnAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI
} from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { toast } from 'react-toastify'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // react-router-dom
    const boardId = '656f2c7ee57083faa909a763'

    fetchBoardDetailsAPI(boardId)
      .then(board => {
        // Sắp xếp thứ tự các column luôn ở đây trước khi đưa xuống bên dưới các component con
        board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

        board.columns.forEach(column => {
          // Xử lý vấn đề column rỗng
          if (isEmpty(column.cards)) {
            column.cards = [generatePlaceholderCard(column)]
            column.cardOrderIds = [generatePlaceholderCard(column)._id]
          } else {
            // Sắp xếp thứ tự các card luôn ở đây trước khi đưa xuống bên dưới các component con
            column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
          }
        })

        setBoard(board)
      })
  }, [])

  // Call the API to create new Column and then redo the state board.
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })
    // Khi tạo column thì chưa có card, cần xử lý vấn đề kéo thả column rỗng
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // Update State Board
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  // Call the API to create a new card and then redo the state board.
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    // Update State Board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      // When a column is empty, it includes a placeholder card.
      if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      } else {
        // If the column has data, push the card to the end of the array.
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }

    setBoard(newBoard)
  }

  // Call the API and handle when dragging and dropping is completed.
  const moveColumns = (dndOrderedColumns) => {

    // Update the state board data standard.
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // Call the API to update board data.
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })
  }

  // Khi di chuyển card trong cùng column: Chỉ cần gọi API để cập nhật cardOrderIds của Coloumn chứa nó. (Thay đổi vị trí trong mảng)
  const moveCardInTheSameColumns = (dndOrderedCards, dndOrderedCardIds, columnId) => {

    // Update the state board data standard.
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    setBoard(newBoard)

    // Call the API to update board data.
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  // When moving cards to a different column:
  // Step 1: Update cardOrderIds of the original column (remove the card _id from the array)
  // Step 2: Update cardOrderIds of the next column (add the card _id from the array)
  // Step 3: Update the new columnIds of the dragged card
  // => Make a separate support API
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColoumId, dndOrderedColumns) => {
    // Update the state board data standard.
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // Call the API handle in BE.
    let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds

    // Handle the problem when the last card is dragged out of the column.
    // An empty column has a placeholder card, it needs to be deleted before sending data to the backend.
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColoumId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColoumId)?.cardOrderIds
    })
  }

  // Handle delete to a Column and it's Cards
  const deleteColumnDetails = (columnId) => {
    // Update the state board data standard.
    const newBoard = { ...board }
    newBoard.columns =  newBoard.columns.filter(c => c._id !== columnId)
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(_id => _id !== columnId)
    setBoard(newBoard)

    // Call the API handle in BE.
    deleteColumnDetailsAPI(columnId).then(res => {
      toast.success(res?.deleteResult)
    })
  }

  if (!board) {
    return (
      <Box sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2
      }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}

        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumns={moveCardInTheSameColumns}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
        deleteColumnDetails={deleteColumnDetails}
      />
    </Container>
  )
}

export default Board
