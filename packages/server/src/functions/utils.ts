export function asyncPipe(...fns: Function[]) {
    return (x: any) => fns.reduce((y, fn) => {
        return y instanceof Promise ? y.then(yr => fn(yr)) : fn(y)
    }, x)
}