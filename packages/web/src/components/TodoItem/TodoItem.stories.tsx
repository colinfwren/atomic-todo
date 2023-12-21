import React from 'react'
import {ComponentMeta, ComponentStory} from '@storybook/react'
import {TodoItem} from './TodoItem'

export default  {
  title: 'Todo Item',
  component: TodoItem
} as ComponentMeta<typeof TodoItem>

export const Checked: ComponentStory<typeof TodoItem> = () => <TodoItem id='test-todo-item'  index={0} />