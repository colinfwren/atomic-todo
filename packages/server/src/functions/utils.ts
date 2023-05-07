export function asyncPipe(...fns: Function[]) {
    return (x: any) => fns.reduce((y, fn) => {
        return y instanceof Promise ? y.then(yr => fn(yr)) : fn(y)
    }, x)
}

export function convertDateToUTC(date: Date): Date {
    return new Date(`${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}T00:00:00.000Z`)
}