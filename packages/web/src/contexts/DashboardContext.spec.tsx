import {render, waitFor} from "@testing-library/react";
import {MockedProvider, MockedResponse} from "@apollo/client/testing";
import {useContext} from "react";
import DashboardContext, {DashboardProvider} from "./DashboardContext";
import {GET_TODOBOARDS_QUERY} from "../constants";
import {testTodoBoard} from "../testData";

const BOARDS_TEST_ID = 'boards'
const LOADING_TEST_ID = 'loading'
const ERROR_TEST_ID = 'error'
const ERROR_MESSAGE = 'unable to fetch todoBoards'

function DashboardContextValues() {
  const { boards, loading, error } = useContext(DashboardContext)
  return (
    <>
      <p data-testid={BOARDS_TEST_ID}>{JSON.stringify(boards)}</p>
      <p data-testid={LOADING_TEST_ID}>{JSON.stringify(loading)}</p>
      <p data-testid={ERROR_TEST_ID}>{JSON.stringify(error)}</p>
    </>
  )
}

function dashboardTest(mocks: MockedResponse<Record<string, any>, Record<string, any>>[]) {
  return render(
    <MockedProvider mocks={mocks}>
      <DashboardProvider>
        <DashboardContextValues />
      </DashboardProvider>
    </MockedProvider>
  )
}

describe('DashboardContext', () => {
  it('provides the array of boards when successfully fetching boards for user', async () => {
    const mocks = [
      {
        request: {
          query: GET_TODOBOARDS_QUERY,
        },
        result: {
          data: {
            getTodoBoards: [testTodoBoard]
          }
        }
      }
    ]
    const { getByTestId } = dashboardTest(mocks)
    await waitFor(() => expect(getByTestId(LOADING_TEST_ID)).toHaveTextContent('true'))
    await waitFor(() => expect(getByTestId(LOADING_TEST_ID)).toHaveTextContent('false'))
    expect(getByTestId(BOARDS_TEST_ID)).toHaveTextContent(JSON.stringify([
      {
        id: testTodoBoard.id,
        name: testTodoBoard.name
      }
    ]
    ))
    expect(getByTestId(ERROR_TEST_ID)).toHaveTextContent('null')
  })
  it('provides the error message if there is an issue fetching boards for user', async () => {
    const mocks = [
      {
        request: {
          query: GET_TODOBOARDS_QUERY,
        },
        error: new Error(ERROR_MESSAGE)
      }
    ]
    const { getByTestId } = dashboardTest(mocks)
    await waitFor(() => expect(getByTestId(LOADING_TEST_ID)).toHaveTextContent('true'))
    await waitFor(() => expect(getByTestId(LOADING_TEST_ID)).toHaveTextContent('false'))
    expect(getByTestId(BOARDS_TEST_ID)).toHaveTextContent('')
    expect(getByTestId(ERROR_TEST_ID)).toHaveTextContent(ERROR_MESSAGE)
  })
})