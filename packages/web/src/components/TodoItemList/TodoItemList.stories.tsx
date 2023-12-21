import React from 'react'
import {ComponentMeta, ComponentStory} from '@storybook/react'
import {TodoItemList} from './TodoItemList'
import {TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";

export default  {
  title: 'Todo List',
  component: TodoItemList
} as ComponentMeta<typeof TodoItemList>

const pastDate = new Date('1988-01-12T00:00:00.000Z')
const todayDate = new Date('2023-04-03T00:00:00.000Z')
const futureDate = new Date('2024-01-01T00:00:00.000Z')

export const PastList: ComponentStory<typeof TodoItemList> = () => <TodoItemList id='day-1' granularity={TodoLevel.Day} currentDate={todayDate} listStartDate={pastDate} listPeriodDelta={1}/>
export const TodayList: ComponentStory<typeof TodoItemList> = () => <TodoItemList id='day-1' granularity={TodoLevel.Day} currentDate={todayDate} listStartDate={todayDate} listPeriodDelta={1} />
export const FutureList: ComponentStory<typeof TodoItemList> = () => <TodoItemList id='day-1' granularity={TodoLevel.Day} currentDate={todayDate} listStartDate={futureDate} listPeriodDelta={1} />