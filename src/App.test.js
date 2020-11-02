import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from './App';
import * as api from './api'
import { cache } from 'swr'

describe('App', () => {
  let mockData
  beforeEach(() => {
    mockData = { name: 'jack' }
    jest.spyOn(api, 'fetcher').mockImplementation(async () => {
      return mockData
    })
    jest.spyOn(api, 'update').mockImplementation(async (data) => {
      Object.assign(mockData, data)
    })
  })
  afterEach(() => {
    jest.restoreAllMocks()
    cache.clear()
  })
  function mockApiUpdateFailed() {
    jest.spyOn(api, 'update').mockImplementation(async (data) => {
    })
  }
  it('sets name to upper class one if api update was successful', async () => {
    const { getByText, queryByText } = render(<App randomKey="key1"/>);
    await waitFor(async function() {
      const el = getByText('NAME: jack')
      expect(el).toBeInTheDocument();
    })

    const btn = getByText('Uppercase my name!')
    fireEvent.click(btn)

    await waitFor(async function() {
      const el = await getByText('NAME: JACK')
      expect(el).toBeInTheDocument();
    })
    await waitFor(async function() {
      const el = await queryByText('NAME: jack')
      expect(el).toBeNull()
    })
  })
  it('sets name to upper class one and rolls it back if api update was unsuccessful', async () => {
    mockApiUpdateFailed()
    const { getByText } = render(<App randomKey="key2"/>);
    await waitFor(async function() {
      const el = getByText('NAME: jack')
      expect(el).toBeInTheDocument();
    })

    const btn = getByText('Uppercase my name!')
    fireEvent.click(btn)

    await waitFor(async function() {
      const el = await getByText('NAME: JACK')
      expect(el).toBeInTheDocument();
    })

    await waitFor(async function() {
      const el = getByText('NAME: jack')
      expect(el).toBeInTheDocument();
    })
  })

})
