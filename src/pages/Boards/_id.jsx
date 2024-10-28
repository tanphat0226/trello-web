//Board details
import { useEffect } from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { useDispatch, useSelector } from 'react-redux'
import { cloneDeep } from 'lodash'

import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import { moveCardToDifferentColumnAPI, updateBoardDetailsAPI, updateColumnDetailsAPI } from '~/apis'
import {
  selectCurrentActiveBoard,
  updateCurrentActiveBoard,
  fetchBoardDetailsAPI
} from '~/redux/activeBoard/activeBoardSlice'
import { useParams } from 'react-router-dom'

function Board() {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const { boardId } = useParams()

  useEffect(() => {
    // const boardId = '656f2c7ee57083faa909a763'

    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch, boardId])

  // Call the API and handle when dragging and dropping is completed.
  const moveColumns = (dndOrderedColumns) => {
    // Update the state board data standard.
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)

    // Use Spread Operator to clone the board data. Cause we don't want to mutate the original state.
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    dispatch(updateCurrentActiveBoard(newBoard))

    // Call the API to update board data.
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })
  }

  // Khi di chuyển card trong cùng column: Chỉ cần gọi API để cập nhật cardOrderIds của Coloumn chứa nó. (Thay đổi vị trí trong mảng)
  const moveCardInTheSameColumns = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    // Update the state board data standard.
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find((column) => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    dispatch(updateCurrentActiveBoard(newBoard))

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
    dispatch(updateCurrentActiveBoard(newBoard))

    // Call the API handle in BE.
    let prevCardOrderIds = dndOrderedColumns.find((c) => c._id === prevColumnId)?.cardOrderIds

    // Handle the problem when the last card is dragged out of the column.
    // An empty column has a placeholder card, it needs to be deleted before sending data to the backend.
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColoumId,
      nextCardOrderIds: dndOrderedColumns.find((c) => c._id === nextColoumId)?.cardOrderIds
    })
  }

  if (!board) {
    return (
      <Box
        sx={{
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
        // 3 moves case thì để nguyên để code xử lý kéo thả  ở boardContent không bị quá dài khó kiểm soát khi đọc code, maintain.
        moveColumns={moveColumns}
        moveCardInTheSameColumns={moveCardInTheSameColumns}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
