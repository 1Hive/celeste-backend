import React from 'react'
import Store from '../../store/store'
import { Link } from 'react-router-dom'
import JurorsActions from '../../actions/jurors'
import { fromWei } from 'web3-utils'
import { toDate } from '../../helpers/toDate'

export default class JurorsList extends React.Component {
  constructor(props){
    super(props)
    this.state = { jurors: null, module: null }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(JurorsActions.findAll())
    Store.dispatch(JurorsActions.findModule())
  }

  render() {
    const { jurors, module } = this.state
    return (
      <div ref="jurorsList">
        <h3>Jurors</h3>
        { (!jurors || !module) ? <em>Loading...</em> : jurors.length === 0 ?
          <em>None</em> :
          <div ref="jurorsWrapper">
            <div ref="jurorsSummary">
              <p>Total staked balance: {fromWei(module.totalStaked)} </p>
              <p>Total active balance: {fromWei(module.totalActive)} </p>
              <p>Total deactivation balance: {fromWei(module.totalDeactivation)} </p>
              <p>Total number of jurors: {jurors.length} </p>
              <p>Total number of active jurors: {jurors.filter(juror => juror.activeBalance > 0).length} </p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Address</th>
                  <th>Active HNY</th>
                  <th>Locked HNY</th>
                  <th>Staked HNY</th>
                  <th>Deactivating HNY</th>
                  <th>Created at</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {this._buildList()}
              </tbody>
            </table>
          </div>
        }
      </div>
    )
  }

  _buildList() {
    return this.state.jurors.map((juror, index) => {
      return (
        <tr key={index}>
          <td><Link to={`/jurors/${juror.id}/detail`}><b>{juror.treeId}</b></Link></td>
          <td>{juror.id}</td>
          <td>{fromWei(juror.activeBalance)}</td>
          <td>{fromWei(juror.lockedBalance)}</td>
          <td>{fromWei(juror.availableBalance)}</td>
          <td>{fromWei(juror.deactivationBalance)}</td>
          <td>{toDate(juror.createdAt)}</td>
          <td>
            <Link to={`/jurors/${juror.id}/drafts`}><b>drafts</b></Link> | <Link to={`/jurors/${juror.id}/staking`}><b>staking</b></Link> | <Link to={`/jurors/${juror.id}/accounting`}><b>accounting</b></Link>
          </td>
        </tr>
      )
    })
  }

  _onChange() {
    if(this.refs.jurorsList) {
      const { list, module } = Store.getState().jurors
      this.setState({ jurors: list, module })
    }
  }
}
