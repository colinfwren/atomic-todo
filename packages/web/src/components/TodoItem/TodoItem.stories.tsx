import React from 'react'
import {ComponentMeta, ComponentStory} from '@storybook/react'
import {TodoItem} from './TodoItem'
import { TODO_ID } from "../../testData";

export default  {
  title: 'Todo Item',
  component: TodoItem
} as ComponentMeta<typeof TodoItem>

export const Checked: ComponentStory<typeof TodoItem> = () => <TodoItem id={TODO_ID}  index={0} />