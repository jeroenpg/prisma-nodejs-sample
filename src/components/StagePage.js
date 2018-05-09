import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import {Timeline, TimelineEvent} from 'react-event-timeline'

class StagePage extends React.Component {

  componentDidMount(){
  }

  render() {
    if (this.props.projectQuery.loading) {
      return (
        <div className="flex w-100 h-100 items-center justify-center pt7">
          <div>Loading (from {process.env.REACT_APP_GRAPHQL_ENDPOINT})</div>
        </div>
      )
    }

    return (
      <React.Fragment>
          <div>{this.props.projectQuery.project && this.props.projectQuery.project.title}</div>
      </React.Fragment>
    )
  }
}

const PROJECTS_QUERY = gql`
  query ProjectQuery($projectId: String!) {
    project(id: $projectId) {
      id
      title
      stages {
        id
        title
      }
    }
  }
`


export default graphql(PROJECTS_QUERY, {
  name: 'projectQuery', // name of the injected prop: this.props.feedQuery...
  options: props => ({
    variables: {
      projectId: props.projectId,
    },
    fetchPolicy: 'network-only',
  })
})(StagePage)
