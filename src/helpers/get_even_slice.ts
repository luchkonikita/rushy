function getEvenSlice(list: string[], slices: number, index: number): string[] {
  const largeSlices: number = list.length % slices
  const large: number = Math.ceil(list.length / slices)
  const normal: number = Math.floor(list.length / slices)

  const start = Math.min(index, largeSlices) * large + Math.max(0, index - largeSlices) * normal
  const end = start + (index < largeSlices ? large : normal)

  return list.slice(start, end)
}

export default getEvenSlice
