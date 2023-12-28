import React from 'react'
import {ComponentMeta, ComponentStory} from '@storybook/react'
import {TodoItemList} from './TodoItemList'
import {TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";
import {TodoListEra} from "../../types";

export default  {
  title: 'Todo List',
  component: TodoItemList
} as ComponentMeta<typeof TodoItemList>

const pastProps = {
  id: 'past',
  granularity: TodoLevel.Day,
  era: TodoListEra.past,
  listStartDate: new Date('1988-01-12T00:00:00.000Z'),
  listEndDate: new Date('1988-01-13T00:00:00.000Z'),
  listPeriodDelta: 1,
  todos: []
}

const currentProps = {
  ...pastProps,
  era: TodoListEra.current
}

const futureProps = {
  ...pastProps,
  era: TodoListEra.future
}

export const PastList: ComponentStory<typeof TodoItemList> = () => <TodoItemList {...pastProps} />
export const TodayList: ComponentStory<typeof TodoItemList> = () => <TodoItemList {...currentProps} />
export const FutureList: ComponentStory<typeof TodoItemList> = () => <TodoItemList {...futureProps} />