describe('Progressing the board scope forward a week', () => {
  it('throws an error if unable to get the TodoBoard', () => {})
  it('throws an error if unable to parse the startDate of the current TodoBoard', () => {})
  it('throws an error if an error is thrown when processing the Month level TodoLists', () => {})
  it('throws an error if an error is thrown when processing the Week level TodoLists', () => {})
  it('throws an error if an error is thrown when processing the Day level TodoLists', () => {})
  it('throws an error if unable to update the TodoBoard doc with the new TodoBoard data', () => {})
  it('throws an error if unable to read the updated TodoBoard, TodoLists and Todo docs', () => {})
  it('returns the updated TodoBoard, TodoLists, Todo data', () => {})
})

describe('Processing the Month level TodoLists for a TodoBoard that has progressed a week', () => {
  it('throws an error if unable to parse the startDate of the current TodoBoard', () => {})
  it('throws an error if unable to parse the new board date', () => {})
  it('returns the existing TodoBoard if new board date is within the same month', () => {})
  it('throws an error if unable to create the new Month level TodoList when needed', () => {})
  it('returns an updated TodoBoard with the current Month level TodoList removed and the new Month level TodoList added', () => {})
})

describe('Processing the Week level TodoLists for a TodoBoard that has progressed a week', () => {
  it('throws an error if unable to read the doc for the last Month level TodoList in the TodoBoard', () => {})
  it('throws an error if unable to parse the startDate of the current last Week level TodoList in the TodoBoard', () => {})
  it('throws an error if unable to find the doc for the Month level TodoList that the new Week level TodoList would fall under', () => {})
  it('throws an error if unable to create the new Week level TodoList', () => {})
  it('returns an updated TodoBoard with the current Week level TodoList removed and the new Week level TodoList added', ()  => {})
})

describe('Processing the Day level TodoLists for a TodoBoard that has progressed a week', () => {
  it('throws an error if unable to copy the startDate passed in', () => {})
  it('throws an error if unable to read the first week from the TodoBoard', () => {})
  it('throws an error if unable to create a new Day level TodoList', () => {})
  it('returns an updated TodoBoard with the current Day level TodoLists removed and the new Day level TodoLists added', () => {})
})