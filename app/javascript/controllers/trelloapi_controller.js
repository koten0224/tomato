import { Controller } from "stimulus"
import Rails from "@rails/ujs"

export default class extends Controller {
  static targets = ["select_board", "select_card", "select_list"]
  trello_token = ""
  api_key = "f91cef06b7d1a94754eac87835224aeb"
  
  authenticationSuccess = function() {
    console.log('Successful authentication')
    
  }
  
  authenticationFailure = function() {
    console.log('Failed authentication')
  }
  trelloAuthorize = function() {
    let that = this
    return new Promise(function(resolve, reject){
      window.Trello.authorize({
        type: 'popup',
        name: 'start',
        scope: {
          read: 'true',
          write: 'true' },
        expiration: 'never',
        success:  (data) => {
                        that.authenticationSuccess()
                        that.trello_token = localStorage.trello_token
                        resolve(data)
                        },
        error: that.authenticationFailure
      })
    })
  }

  get_token(e){
    e.preventDefault()
    window.Trello.authorize({
      type: 'popup',
      name: 'Getting Started Application',
      scope: {
        read: 'true',
        write: 'true' },
      expiration: 'never',
      success: this.authenticationSuccess,
      error: this.authenticationFailure
    })
    .then((text) => {
      const submitData = {token: this.trello_token}
      Rails.ajax({
        url: `/trelloapi/get_boards`, 
        type: 'POST', 
        dataType: 'json',
        beforeSend(xhr, options) {
          xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
          options.data = JSON.stringify(submitData)
          return true
        },
        success: resp => {
          console.log(resp)
        }, 
        error: err => {
          console.log(err);
        } 
      })
    })
    .catch(err => console.error(err))    
    
  }



  select_board(e){
    console.log(this.select_boardTarget.value)
    const submitData = { board_id: this.select_boardTarget.value}
    Rails.ajax({
      url: `/trelloapi/get_cards`, 
      type: 'POST', 
      dataType: 'json',
      beforeSend(xhr, options) {
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
        options.data = JSON.stringify(submitData)
        return true
      },
      success: resp => {
        console.log("get card!!!")
        console.log(resp)    
      }, 
      error: err => {
        console.log(err);
      } 
    })
  } 

  select_list(){
    let check_item = document.querySelectorAll("input.select_list")
    for (let i = 0; i < check_item.length; i++){
      if(check_item[i].checked === false){
        document.querySelectorAll(`.select_card#${check_item[i].id}`).forEach((card)=>{card.classList.add("d-none")})
        document.querySelectorAll(`li.select_card${check_item[i].name}`).forEach((card)=>{card.classList.add("d-none")})
      }else{
        document.querySelectorAll(`.select_card#${check_item[i].id}`).forEach((card)=>{card.classList.remove("d-none")})
        document.querySelectorAll(`li.select_card${check_item[i].name}`).forEach((card)=>{card.classList.remove("d-none")})
      }
      
    } 
  }
}