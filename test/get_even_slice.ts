import { test } from 'ava'
import getEvenSlice from '../src/helpers/get_even_slice'

const list: string[] = ['1', '2', '3', '4', '5', '6']

test('slice evenly when modulo = 0', t => {
  t.deepEqual(getEvenSlice(list, 3, 0), ['1', '2'])
  t.deepEqual(getEvenSlice(list, 3, 1), ['3', '4'])
  t.deepEqual(getEvenSlice(list, 3, 2), ['5', '6'])
})

test('slice evenly when remainder is non-zero', t => {
  const largeList: string[] = ['1', '2', '3', '4', '5', '6', '7', '8']
  t.deepEqual(getEvenSlice(largeList, 3, 0), ['1', '2', '3'])
  t.deepEqual(getEvenSlice(largeList, 3, 1), ['4', '5', '6'])
  t.deepEqual(getEvenSlice(largeList, 3, 2), ['7', '8'])
})

test('return empty list for an empty list', t => {
  t.deepEqual(getEvenSlice([], 3, 0), [])
})

test('return empty lists for non-existent slices', t => {
  t.deepEqual(getEvenSlice(list, 8, 0), ['1'])
  t.deepEqual(getEvenSlice(list, 8, 1), ['2'])
  t.deepEqual(getEvenSlice(list, 8, 2), ['3'])
  t.deepEqual(getEvenSlice(list, 8, 3), ['4'])
  t.deepEqual(getEvenSlice(list, 8, 4), ['5'])
  t.deepEqual(getEvenSlice(list, 8, 5), ['6'])
  t.deepEqual(getEvenSlice(list, 8, 6), [])
  t.deepEqual(getEvenSlice(list, 8, 7), [])
})

test('slice once and return no additional slices', t => {
  t.deepEqual(getEvenSlice(list, 1, 0), list)
  t.deepEqual(getEvenSlice(list, 1, 1), [])
})
