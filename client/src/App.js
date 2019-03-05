import React, { Component } from 'react';
import { Picker, emojiIndex } from 'emoji-mart';
import { Smile } from 'react-feather';
import ReactTextareaAutocomplete from '@webscopeio/react-textarea-autocomplete';

import {
  handleInput,
  connectToChatkit,
  connectToRoom,
  sendMessage,
  sendDM,
  addEmoji,
  toggleEmojiPicker,
  handleKeyPress,
} from './methods';
import Dialog from './components/Dialog';
import RoomList from './components/RoomList';
import ChatSession from './components/ChatSession';
import RoomUsers from './components/RoomUsers';

import 'emoji-mart/css/emoji-mart.css';
import 'skeleton-css/css/normalize.css';
import 'skeleton-css/css/skeleton.css';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      userId: '',
      showLogin: true,
      isLoading: false,
      currentUser: null,
      currentRoom: null,
      rooms: [],
      roomUsers: [],
      roomName: null,
      messages: [],
      newMessage: '',
      showEmojiPicker: false,
    };

    this.handleInput = handleInput.bind(this);
    this.connectToChatkit = connectToChatkit.bind(this);
    this.connectToRoom = connectToRoom.bind(this);
    this.sendMessage = sendMessage.bind(this);
    this.sendDM = sendDM.bind(this);
    this.addEmoji = addEmoji.bind(this);
    this.toggleEmojiPicker = toggleEmojiPicker.bind(this);
    this.handleKeyPress = handleKeyPress.bind(this);
  }

  render() {
    const {
      userId,
      showLogin,
      rooms,
      currentRoom,
      currentUser,
      messages,
      newMessage,
      roomUsers,
      roomName,
      showEmojiPicker,
    } = this.state;

    return (
      <div className="App">
        <aside className="sidebar left-sidebar">
          {currentUser ? (
            <div className="user-profile">
              <span className="username">{currentUser.name}</span>
              <span className="user-id">{`@${currentUser.id}`}</span>
            </div>
          ) : null}
          {currentRoom ? (
            <RoomList
              rooms={rooms}
              currentRoom={currentRoom}
              connectToRoom={this.connectToRoom}
              currentUser={currentUser}
            />
          ) : null}
        </aside>
        <section className="chat-screen">
          <header className="chat-header">
            {currentRoom ? <h3>{roomName}</h3> : null}
          </header>
          <ul className="chat-messages">
            <ChatSession messages={messages} />
            {showEmojiPicker ? (
              <Picker set="emojione" onSelect={this.addEmoji} />
            ) : null}
          </ul>
          <footer className="chat-footer">
            <form onSubmit={this.sendMessage} className="message-form">
              <button
                type="button"
                className="toggle-emoji"
                onClick={this.toggleEmojiPicker}
              >
                <Smile />
              </button>
              <ReactTextareaAutocomplete
                className="message-input my-textarea"
                name="newMessage"
                value={newMessage}
                loadingComponent={() => <span>Loading</span>}
                onKeyPress={this.handleKeyPress}
                onChange={this.handleInput}
                placeholder="Compose your message and hit ENTER to send"
                trigger={{
                  ':': {
                    dataProvider: token =>
                      emojiIndex.search(token).map(o => ({
                        colons: o.colons,
                        native: o.native,
                      })),
                    component: ({ entity: { native, colons } }) => (
                      <div>{`${colons} ${native}`}</div>
                    ),
                    output: item => `${item.native}`,
                  },
                }}
              />
            </form>
          </footer>
        </section>
        <aside className="sidebar right-sidebar">
          {currentRoom ? (
            <RoomUsers
              currentUser={currentUser}
              sendDM={this.sendDM}
              roomUsers={roomUsers}
            />
          ) : null}
        </aside>
        {showLogin ? (
          <Dialog
            userId={userId}
            handleInput={this.handleInput}
            connectToChatkit={this.connectToChatkit}
          />
        ) : null}
      </div>
    );
  }
}

export default App;
