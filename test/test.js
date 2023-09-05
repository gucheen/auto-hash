const fs = require('fs')
const {expect, test} = require('@jest/globals')
const autoHash = require('../index')

test('all functions and configurations', async () => {
    const result = await autoHash({
        files: [
            {
                file: 'test/itsy-bitsy-data-structures.js',
                name: 'itsy-bitsy-data-structures',
            },
            {
                file: 'test/simple.css',
                name: 'simpledotcss',
            },
        ],
        output: {
            file: 'test/test-hash.js',
        },
        len: 8,
        rename: false,
        copy: true,
    })
    expect(result).toBeDefined()
    expect(result['itsy-bitsy-data-structures']).toBe('60e524eb')
    expect(result['simpledotcss']).toBe('f776f097')
    expect(fs.existsSync('test/itsy-bitsy-data-structures.60e524eb.js')).toBe(true)
    expect(fs.existsSync('test/test-hash.js')).toBe(true)
    const resultModule = require('./test-hash')
    expect(resultModule).toBeDefined()
    expect(resultModule['itsy-bitsy-data-structures']).toBe('60e524eb')
    expect(resultModule['simpledotcss']).toBe('f776f097')
})
