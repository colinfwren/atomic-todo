import React from 'react'
import {ComponentMeta, ComponentStory} from '@storybook/react'
import {TodoItemBoard} from './TodoItemBoard'

export default  {
  title: 'Todo Board',
  component: TodoItemBoard
} as ComponentMeta<typeof TodoItemBoard>

export const Board: ComponentStory<typeof TodoItemBoard> = () => <TodoItemBoard />