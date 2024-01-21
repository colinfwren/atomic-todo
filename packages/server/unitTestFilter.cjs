module.exports = testPaths => {
    const allowedPaths = testPaths.filter((testPath) => testPath.indexOf('.system.') < 0).map((test) => ({ test }))
    return {
        filtered: allowedPaths
    }
}