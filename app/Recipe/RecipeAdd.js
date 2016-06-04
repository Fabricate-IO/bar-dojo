module.exports = React.createClass({
  // handlePost: function (comment) {
  //   var data = this.state.data;
  //   var newData = state.concat([comment]);
  //   this.setState({data: newData});
  //   $.ajax({
  //     url: this.props.url,
  //     dataType: 'json',
  //     type: 'POST',
  //     data: comment,
  //     success: function (data) {
  //       // already updated state, we're good to go
  //     }.bind(this),
  //     error: function (xhr, status, err) {
  //       this.setState({data: data});
  //       console.error(this.props.url, status, err.toString());
  //     }.bind(this)
  //   });
  // },
  render: function () {
    return (
      <div>
        TODO
      </div>
    );
  },
});



// var CommentForm = React.createClass({
//   getInitialState: function () {
//     return {author: '', text: ''};
//   },
//   handleAuthorChange: function (e) {
//     this.setState({author: e.target.value});
//   },
//   handleTextChange: function (e) {
//     this.setState({text: e.target.value});
//   },
//   handleSubmit: function (e) {
//     e.preventDefault();
//     var author = this.state.author.trim();
//     var text = this.state.text.trim();
//     if (!text || !author) {
//       return;
//     }
//     this.props.onPost({name: author, unitType: text});
//     this.setState({author: '', text: ''});
//   },
//   render: function () {
//     return (
//       <form className="commentForm" onSubmit={this.handleSubmit}>
//         <input
//           type="text"
//           placeholder="Your name"
//           value={this.state.author}
//           onChange={this.handleAuthorChange}
//         />
//         <input
//           type="text"
//           placeholder="Say something..."
//           value={this.state.text}
//           onChange={this.handleTextChange}
//         />
//         <input type="submit" value="Post" />
//       </form>
//     );
//   }
// });
