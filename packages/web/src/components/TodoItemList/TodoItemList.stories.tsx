import React from 'react'
import {ComponentMeta, ComponentStory} from '@storybook/react'
import {TodoItemList} from './TodoItemList'
import {TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";
import { WEEK_ONE_ID } from "../../testData";

export default  {
  title: 'Todo List',
  component: TodoItemList
} as ComponentMeta<typeof TodoItemList>

export const List: ComponentStory<typeof TodoItemList> = () => <TodoItemList id={WEEK_ONE_ID} level={TodoLevel.Week} />