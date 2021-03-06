import React, { Component } from 'react';
import store from '../store';
export default class SavedArticles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            offset: 0,
            limit: 10,
            totalArticles: 2,
        };
        this.nextPage = this.nextPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
        this.removeArticle = this.removeArticle.bind(this);
    }
    componentDidMount() {
        let { state } = this.props;
        this.setState({
            totalArticles: state.getIn(['users', state.get('isAuthenticated'), 'savedArticles']).size
        })
    }
    componentDidUpdate(prevProps) {
        let { state } = this.props;
        if (prevProps.state.getIn(['users', state.get('isAuthenticated'), 'savedArticles']).size != state.getIn(['users', state.get('isAuthenticated'), 'savedArticles']).size)
            this.setState({
                totalArticles: state.getIn(['users', state.get('isAuthenticated'), 'savedArticles']).size
            })
    }
    prevPage() {
        let prevOffset = ((this.state.offset - this.state.limit) >= 0) ? this.state.offset - this.state.limit : 0;
        if (prevOffset != this.state.offset)
            this.setState({
                offset: prevOffset
            })
        else alert('You reached start of the page')
    }
    nextPage() {
        let nextOffset = ((this.state.offset + this.state.limit) > this.state.totalArticles - 1) ? this.state.totalArticles - this.state.limit : this.state.offset + this.state.limit;
        if (nextOffset != this.state.offset)
            this.setState({
                offset: nextOffset
            })
        else alert('You reached end of the page')
    }
    removeArticle(articleID) {
        store.dispatch({
            type: 'REMOVE_ARTICLE',
            id: articleID
        });

    }

    render() {
        let { state } = this.props;
        let articles = state.getIn(['users', state.get('isAuthenticated'), 'savedArticles']);
        articles = articles.toArray().map((i) => i[1]);
        articles = articles.filter((i, index) => index >= this.state.offset && index < (this.state.offset + this.state.limit));
        // articles = articles.splice(parseInt(this.state.offset), parseInt(this.state.limit));
        return (
            (articles.length) ?
            <div id="container">
                    <div className="row">
                        {articles.map((article, index) => {
                        return (
                            <div className="column" key={index}  >
                                <div className="card" onClick={() => { window.open(article.get('url')) }}>
                                    <h3>{article.get('title')}</h3>
                                    <p>{article.get('abstract')}</p>
                                </div>
                                <div className="card">
                                    <button onClick={() => { this.removeArticle(article.get('id')); }}>Remove Article</button>
                                </div>
                            </div>)
                    })}

                </div>
                    <div className="pagination">
                    <a href="#" onClick={this.prevPage}>❮</a>
                    <a href="#" onClick={this.nextPage}>❯</a>
                </div>
                </div > : <div className="window-center"><h5>No items for read later</h5></div>)
    }
}