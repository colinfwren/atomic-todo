import React from 'react'
import {ComponentMeta, ComponentStory} from '@storybook/react'
import {TodoItem} from './TodoItem'
import {TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";
import { TODO_ID, WEEK_ONE_ID } from "../../testData";

export default  {
  title: 'Todo Item',
  component: TodoItem
} as ComponentMeta<typeof TodoItem>

export const Checked: ComponentStory<typeof TodoItem> = () => <TodoItem id={TODO_ID} level={TodoLevel.Day} listId={WEEK_ONE_ID} />