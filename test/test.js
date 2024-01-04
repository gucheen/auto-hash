const fs = require('fs')
const {expect, test} = require('@jest/globals')
const autoHash = require('../index')
const { execSync } = require('child_process')

beforeEach(() => {
    execSync('git clean -xf test')
})

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
            {
                file: 'test/the-super-tiny-compiler.js',
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
    expect(result['itsy-bitsy-data-structures']).toBe('9cd0b02e')
    expect(result['simpledotcss']).toBe('e32024ea')
    expect(result['the-super-tiny-compiler']).toBe('4fe1c2ef')
    expect(fs.existsSync('test/itsy-bitsy-data-structures.9cd0b02e.js')).toBe(true)
    expect(fs.existsSync('test/simple.e32024ea.css')).toBe(true)
    expect(fs.existsSync('test/the-super-tiny-compiler.4fe1c2ef.js')).toBe(true)
    expect(fs.existsSync('test/test-hash.js')).toBe(true)
    const resultModule = require('./test-hash')
    expect(resultModule).toBeDefined()
    expect(resultModule['itsy-bitsy-data-structures']).toBe('9cd0b02e')
    expect(resultModule['simpledotcss']).toBe('e32024ea')
    expect(resultModule['the-super-tiny-compiler']).toBe('4fe1c2ef')
})

test('config validation', async () => {
    await expect(() => {
        return autoHash()
    }).rejects.toThrow()
    await expect(() => {
        return autoHash({
            files: [],
        })
    }).rejects.toThrow()
})

test('use config file', async () => {
    const result = await autoHash({
        config: 'test/config.json',
    })
    expect(result).toBeDefined()
    expect(result['itsy-bitsy-data-structures']).toBe('9cd0b02e')
    expect(result['simple']).toBe('e32024ea')
    expect(result['the-super-tiny-compiler']).toBe('4fe1c2ef')
    expect(fs.existsSync('test/itsy-bitsy-data-structures.9cd0b02e.js')).toBe(true)
    expect(fs.existsSync('test/simple.e32024ea.css')).toBe(true)
    expect(fs.existsSync('test/the-super-tiny-compiler.4fe1c2ef.js')).toBe(true)
    expect(fs.existsSync('test/test-hash-2.js')).toBe(true)
    const resultModule = require('./test-hash-2')
    expect(resultModule).toBeDefined()
    expect(resultModule['itsy-bitsy-data-structures']).toBe('9cd0b02e')
    expect(resultModule['simple']).toBe('e32024ea')
    expect(resultModule['the-super-tiny-compiler']).toBe('4fe1c2ef')
})

test('rename file', async () => {
    await autoHash({
        files: [
            {
                file: 'test/simple.css',
                name: 'simpledotcss',
            },
        ],
        len: 8,
        rename: true,
    })
    expect(fs.existsSync('test/simple.css')).toBe(false)
    expect(fs.existsSync('test/simple.e32024ea.css')).toBe(true)
})
