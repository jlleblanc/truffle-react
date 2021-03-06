import React from 'react'
import Truffle from '../Truffle'
import TruffleRepository from '../../lib/TruffleRepository'
import extractFields from '../../lib/extract-truffle-fields'

class TruffleFeed extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      isLoaded: false,
      truffleRepo: null
    }
  }

  componentDidMount() {
    fetch("/feed.json")
      .then(res => res.json())
      .then(rawFeed => {
        var repo = new TruffleRepository()
        repo.parse(rawFeed)
        return repo
      })
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            truffleRepo: result
          })
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          })
        }
      )
  }

  render() {
    const { error, isLoaded, truffleRepo } = this.state
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          {truffleRepo.hostIdList.map(id => {
              var truffle = truffleRepo.masterList.get(id)
              return <Truffle
                      key={truffle.id}
                      id={truffle.id}
                      hostId={truffle.hostId}
                      timestamp={truffle.timestamp}
                      fields={extractFields(truffle)}
                      guests={truffleRepo.getGuests(truffle)}
                     />
            })
          }
        </div>
      )
    }

  }
}

export default TruffleFeed
