import React from 'react';

import Posts from './Posts.js';
import {getAllPosts} from '../server';
import {resetDatabase} from '../database';

class Tagbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: this.props.tags,
      selected_tags: this.props.selected_tags
    }
  }

  diff(a, b) {
    return a.filter((i) => {return b.indexOf(i) < 0;});
  }

  handleSelect(tag) {
    var index = this.state.tags.indexOf(tag);
    this.state.tags.splice(index,1);
    this.state.selected_tags.push(tag);
    this.setState({});
  }

  handleDeselect(tag) {
    var index = this.state.selected_tags.indexOf(tag);
    this.state.selected_tags.splice(index,1);
    this.state.tags.push(tag);
    this.setState({});
  }

  render() {
    var disjoint = this.diff(this.state.tags, this.state.selected_tags);

    return (
      <div className="col-md-2 panel panel-default tags">
        <ul className="nav">
          <li role="presentation">TAGS</li>
          {this.state.selected_tags.map((tag) => {
             return(
               <li role="presentation">
                 <label type="button" className="btn btn-default active" onClick={() => this.handleDeselect(tag)}>
                   {tag}
                 </label>
               </li>
             )})}
          {disjoint.map((tag) => {
             return(
               <li role="presentation">
                 <label type="button" className="btn btn-default" onClick={() => this.handleSelect(tag)}>
                   {tag}
                 </label>
               </li>
             )})}
        </ul>
      </div>
    )
  }
}

class SearchResults extends React.Component {
  render () {
    return (
      <div className='col-md-10'>
        <div className='panel panel-default'>
          <div className='panel-body .search-text'>
            <text>Search results for: "{this.props.search_term}"</text>
          </div>
        </div>
        {this.props.children}
      </div>
    )
  }
}

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /* Tags will need to be the result of a call to the server*/
      tags: ["Board Games", "Sports", "Music", "Computers", "Clothing", "Language"],
      /* Always start with no selected tags*/
      selected_tags: ["Test"],
      data: []
    }
    getAllPosts((data) => {this.setState({data: data})})
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="clearfix">
          <Tagbar tags={this.state.tags} selected_tags={this.state.selected_tags} />
          <SearchResults search_term={this.props.match.params.query}>
            <Posts posts={this.state.data} />
          </SearchResults>
        </div>
      </div>
    )
  }
}