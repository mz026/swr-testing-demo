import './App.css';
import * as api from './api'

import useSwr, { mutate } from 'swr'

function App({ randomKey }) {
  const path = `/user?r=${randomKey}`
  const { data } = useSwr(path, api.fetcher)
  return (
    <div className="App">
      {
        data ? (<p>NAME: {data.name}</p>) : null
      }
      <button onClick={async () => {
        if (!data) {
          return
        }
        const newName = data.name.toUpperCase()

        mutate(path, { ...data, name: newName }, false)

        await api.update({ name: newName })

        mutate(path)
      }}>Uppercase my name!
      </button>
    </div>
  );
}

export default App;
