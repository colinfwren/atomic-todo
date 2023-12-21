import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type BoardNameUpdateInput = {
  id: Scalars['ID'];
  name: Scalars['String'];
};

export enum ContactPreferences {
  Marketing = 'Marketing',
  NoMarketing = 'NoMarketing'
}

export type Mutation = {
  __typename?: 'Mutation';
  addTodo?: Maybe<TodoBoardResult>;
  deleteTodo?: Maybe<TodoBoardResult>;
  moveBoardBackwardByWeek?: Maybe<TodoBoardResult>;
  moveBoardForwardByWeek?: Maybe<TodoBoardResult>;
  updateBoardName?: Maybe<TodoBoard>;
  updateTodo?: Maybe<Todo>;
  updateTodos?: Maybe<Array<Maybe<Todo>>>;
};


export type MutationAddTodoArgs = {
  boardId: Scalars['ID'];
  endDate: Scalars['Int'];
  startDate: Scalars['Int'];
};


export type MutationDeleteTodoArgs = {
  boardId: Scalars['ID'];
  todoId: Scalars['ID'];
};


export type MutationMoveBoardBackwardByWeekArgs = {
  boardId: Scalars['ID'];
};


export type MutationMoveBoardForwardByWeekArgs = {
  boardId: Scalars['ID'];
};


export type MutationUpdateBoardNameArgs = {
  boardNameUpdate: BoardNameUpdateInput;
};


export type MutationUpdateTodoArgs = {
  todo: TodoUpdateInput;
};


export type MutationUpdateTodosArgs = {
  todos: Array<TodoUpdateInput>;
};

export type Query = {
  __typename?: 'Query';
  getTodoBoard?: Maybe<TodoBoardResult>;
};


export type QueryGetTodoBoardArgs = {
  id: Scalars['ID'];
};

export type Todo = {
  __typename?: 'Todo';
  completed: Scalars['Boolean'];
  deleted: Scalars['Boolean'];
  endDate: Scalars['Int'];
  id: Scalars['ID'];
  name: Scalars['String'];
  showInMonth: Scalars['Boolean'];
  showInWeek: Scalars['Boolean'];
  showInYear: Scalars['Boolean'];
  startDate: Scalars['Int'];
};

export type TodoBoard = {
  __typename?: 'TodoBoard';
  id: Scalars['ID'];
  name: Scalars['String'];
  startDate: Scalars['Int'];
};

export type TodoBoardResult = {
  __typename?: 'TodoBoardResult';
  board: TodoBoard;
  todos: Array<Todo>;
};

export enum TodoLevel {
  Day = 'day',
  Month = 'month',
  Week = 'week'
}

export type TodoUpdateInput = {
  completed?: InputMaybe<Scalars['Boolean']>;
  endDate?: InputMaybe<Scalars['Int']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  showInMonth?: InputMaybe<Scalars['Boolean']>;
  showInWeek?: InputMaybe<Scalars['Boolean']>;
  showInYear?: InputMaybe<Scalars['Boolean']>;
  startDate?: InputMaybe<Scalars['Int']>;
};

export type User = {
  __typename?: 'User';
  contactPreferences: ContactPreferences;
  email: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;


/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  BoardNameUpdateInput: BoardNameUpdateInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  ContactPreferences: ContactPreferences;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Todo: ResolverTypeWrapper<Todo>;
  TodoBoard: ResolverTypeWrapper<TodoBoard>;
  TodoBoardResult: ResolverTypeWrapper<TodoBoardResult>;
  TodoLevel: TodoLevel;
  TodoUpdateInput: TodoUpdateInput;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  BoardNameUpdateInput: BoardNameUpdateInput;
  Boolean: Scalars['Boolean'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Mutation: {};
  Query: {};
  String: Scalars['String'];
  Todo: Todo;
  TodoBoard: TodoBoard;
  TodoBoardResult: TodoBoardResult;
  TodoUpdateInput: TodoUpdateInput;
  User: User;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addTodo?: Resolver<Maybe<ResolversTypes['TodoBoardResult']>, ParentType, ContextType, RequireFields<MutationAddTodoArgs, 'boardId' | 'endDate' | 'startDate'>>;
  deleteTodo?: Resolver<Maybe<ResolversTypes['TodoBoardResult']>, ParentType, ContextType, RequireFields<MutationDeleteTodoArgs, 'boardId' | 'todoId'>>;
  moveBoardBackwardByWeek?: Resolver<Maybe<ResolversTypes['TodoBoardResult']>, ParentType, ContextType, RequireFields<MutationMoveBoardBackwardByWeekArgs, 'boardId'>>;
  moveBoardForwardByWeek?: Resolver<Maybe<ResolversTypes['TodoBoardResult']>, ParentType, ContextType, RequireFields<MutationMoveBoardForwardByWeekArgs, 'boardId'>>;
  updateBoardName?: Resolver<Maybe<ResolversTypes['TodoBoard']>, ParentType, ContextType, RequireFields<MutationUpdateBoardNameArgs, 'boardNameUpdate'>>;
  updateTodo?: Resolver<Maybe<ResolversTypes['Todo']>, ParentType, ContextType, RequireFields<MutationUpdateTodoArgs, 'todo'>>;
  updateTodos?: Resolver<Maybe<Array<Maybe<ResolversTypes['Todo']>>>, ParentType, ContextType, RequireFields<MutationUpdateTodosArgs, 'todos'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getTodoBoard?: Resolver<Maybe<ResolversTypes['TodoBoardResult']>, ParentType, ContextType, RequireFields<QueryGetTodoBoardArgs, 'id'>>;
};

export type TodoResolvers<ContextType = any, ParentType extends ResolversParentTypes['Todo'] = ResolversParentTypes['Todo']> = {
  completed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  deleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  endDate?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  showInMonth?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  showInWeek?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  showInYear?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TodoBoardResolvers<ContextType = any, ParentType extends ResolversParentTypes['TodoBoard'] = ResolversParentTypes['TodoBoard']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TodoBoardResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['TodoBoardResult'] = ResolversParentTypes['TodoBoardResult']> = {
  board?: Resolver<ResolversTypes['TodoBoard'], ParentType, ContextType>;
  todos?: Resolver<Array<ResolversTypes['Todo']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  contactPreferences?: Resolver<ResolversTypes['ContactPreferences'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Todo?: TodoResolvers<ContextType>;
  TodoBoard?: TodoBoardResolvers<ContextType>;
  TodoBoardResult?: TodoBoardResultResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

