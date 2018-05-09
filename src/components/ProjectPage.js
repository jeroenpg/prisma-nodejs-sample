import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Timeline, TimelineEvent } from 'react-event-timeline'
import AutoForm from 'uniforms-antd/AutoForm'
import GraphQLBridge    from 'uniforms/GraphQLBridge'

import {makeExecutableSchema} from 'graphql-tools';

const executableSchema = makeExecutableSchema({
  typeDefs: `
      type Author {
          id:        Int!
          firstName: String
          lastName:  String
          nice:  Boolean
      }
  
      type Post {
          id:     Int!
          title: String
          votes:  Int
          author: [Author!]
      }
  
      # This is required by buildASTSchema
      type Query { anything: ID }
  `
})

const schemaType = executableSchema.getType('Post')

const schemaValidator = model => {
  const details = []

  if (!model.id) {
    details.push({name: 'id', message: 'ID is required!'})
  }

  // ...

  if (details.length) {
    throw {details}
  }
};

const bridge = new GraphQLBridge(schemaType, schemaValidator, {
  id:   {label: 'ID'},
  title:  {label: 'Title'},
  votes: {label: 'Votes'},
  'author': {label: 'Add an author'},
  'author.$.id': {label: 'Author ID'},
  'author.$.firstName': {label: 'First name'},
  'author.$.lastName': {label: 'Last name'},
  'author.$.nice': {label: 'Nice'}
})

class ProjectPage extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.location.key !== nextProps.location.key) {
      this.props.projectsQuery.refetch()
    }
  }

  componentDidMount(){
    //this.props.subscribeToNewFeed()
  }

  render() {
    if (this.props.projectsQuery.loading) {
      return (
        <div className="flex w-100 h-100 items-center justify-center pt7">
          <div>Loading (from {process.env.REACT_APP_GRAPHQL_ENDPOINT})</div>
        </div>
      )
    }

    return (
      <React.Fragment>
        <AutoForm schema={bridge} onSubmit={doc => { console.log(doc) }} model={{title: 'laValue'}}/>

        {this.props.projectsQuery.projects &&
        this.props.projectsQuery.projects.map(project => (
          <button key={project.id} onClick={() => {
            this.props.history.replace(`/project/${project.id}`)
          }}>{project.title}</button>
        ))}
      </React.Fragment>
    )
  }
}

const PROJECTS_QUERY = gql`
  query ProjectsQuery {
    projects {
      id
      title
    }
  }
`
const FEED_SUBSCRIPTION = gql`
  subscription {
    feedSubscription {
      id
      text
      title
      isPublished
       author{
          name
      }
    }
  }
`

export default graphql(PROJECTS_QUERY, {
  name: 'projectsQuery', // name of the injected prop: this.props.feedQuery...
  options: {
    fetchPolicy: 'network-only',
  },
  props: props =>
    Object.assign({}, props, {
      // subscribeToNewFeed: params => {
      //   console.log(props)
      //   return props.feedQuery.subscribeToMore({
      //     document: FEED_SUBSCRIPTION,
      //     updateQuery: (prev, { subscriptionData }) => {
      //       console.log('subscribed data', subscriptionData)
      //       if (!subscriptionData.data) {
      //         return prev
      //       }
      //       const newPost = subscriptionData.data.feedSubscription
      //       console.log(newPost, prev.feed)
      //       if (prev.feed.find(post => post.id === newPost.id)) {
      //         return prev
      //       }
      //       return Object.assign({}, prev, {
      //         feed : [...prev.feed, newPost]
      //       })
      //     }
      //   })
      // }
    })
})(ProjectPage)
