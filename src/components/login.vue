<template>
    <div id="container">
      <form id="login" @submit.prevent="handleSubmit">
        <h2 id="title">登录</h2>
        <div id="login-yonghuming">
          <input id="yonghuming" v-model="username" placeholder="用户名" type="text" maxlength="30" />
        </div>
        <input id="mima" v-model="password" placeholder="密码" type="password" maxlength="30" />
        <div v-if="showError" id="tishi">账号或密码错误,请重试</div>
        <div>
          <span>输入验证码:</span>
          <input v-model="enteredCode" type="text" id="verification_code" />
          <span id="code" @click="refreshVerificationCode">{{ generatedCode }}</span>
        </div>
        <div v-if="showVerificationError" id="yan">验证码错误</div>
        <input type="submit" id="login-button" value="登录" />
        <div class="register-link">
          <router-link to="/register">还没有账号？点击注册</router-link>
        </div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const username = ref('')
  const password = ref('')
  const enteredCode = ref('')
  const generatedCode = ref(generateVerificationCode())
  const showError = ref(false)
  const showVerificationError = ref(false)
  const router = useRouter()
  
  function generateVerificationCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let code = ''
    for (let i = 0; i < 4; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return code
  }
  
  function refreshVerificationCode() {
    generatedCode.value = generateVerificationCode()
  }
  
  async function handleSubmit() {
    if (!validateInputs()) return
  
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username: username.value, password: password.value })
      })
  
      const data = await response.json()
      console.log('Server response:', data)
  
      if (data.code === 200) {
        showError.value = false
        router.push('/index')
      } else {
        showError.value = true
      }
    } catch (error) {
      console.error('Error during login:', error)
      showError.value = true
    }
  }
  
  function validateInputs(): boolean {
    if (enteredCode.value.trim() !== generatedCode.value) {
      showVerificationError.value = true
      refreshVerificationCode()
      return false
    }
  
    showVerificationError.value = false
    return true
  }
  </script>

<style>
* {
    margin: 0;
    padding: 0;
}
html{
    height: 100%;
    overflow: hidden; /* 禁止滚动 */
}
body{
    overflow: hidden;
    position: relative;
    width: 100%;
    height: 100%;
}
#container{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
#title{
    margin-bottom: 30px;
    font-size: 3rem;
    color: rgb(40, 40, 40);
}
#yonghuming{
    border: #444;
    border-radius: 100px;
    height: 50px;
    width: 400px;
    background-color:#eaeaea;
    text-indent: 40px;
    line-height: 1;
    font-weight: 600;
    font-size: 1.2rem;
}
#mima{
    border: #444;
    margin-top: 30px;
    border-radius: 100px;
    height: 50px;
    width: 400px;
    background-color:#eaeaea;
    text-indent: 40px;
    line-height: 1;
    font-weight: 600;
    font-size: 1.2rem;
}
#login{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0rem 5rem;
    overflow: hidden;
    background-color:#fff;
    height: 800px;
}
#login-button{
    width: 150px;
    background-color: #5995fd;
    line-height: 50px;
    text-align: center;
    height: 50px;
    border-radius: 50px;
    color: #fff;
    font-size: large;
    margin: 10px 0;
    cursor: pointer;
}
#login-button{
    margin-top: 20px;
}
#change{
    text-decoration: none;
    margin-right: 100px;
}
#sign-up{
    text-decoration: none;
}
#container::before{
        content: "";
        position: absolute;
        height: 2000px;
        width: 2000px;
        left: 0%;
        transform: translate(-100%,-50%);
        background-color:#04befe;
        border-radius: 200%;
        animation-name: move1;
        animation-duration: 2s;
        z-index: 9999;
}
#container::after{
        content: "";
        position: absolute;
        height: 2000px;
        width: 2000px;
        right: 0%;
        transform: translate(100%,-50%);
        background-color:#04befe;
        border-radius: 200%;
        animation-name: move2;
        animation-duration: 2s;
        z-index: 9999;
}
#achieve{
    position: relative;
    transform: translate(50%,50%);
}
#container::v-deep(before) {
    content: "";
    position: absolute;
    height: 2000px;
    width: 2000px;
    left: 0%;
    transform: translate(-100%, -50%);
    background-color: #04befe;
    border-radius: 200%;
    animation-name: move1;
    animation-duration: 2s;
    z-index: 9999;
}

#container::v-deep(after) {
    content: "";
    position: absolute;
    height: 2000px;
    width: 2000px;
    right: 0%;
    transform: translate(100%, -50%);
    background-color: #04befe;
    border-radius: 200%;
    animation-name: move2;
    animation-duration: 2s;
    z-index: 9999;
}

@keyframes move1 {
    from {
        border-radius: 0%;
        transform: translate(-70%, -50%);
    }
    to {
        border-radius: 100%;
        transform: translate(-100%, -50%);
    }
}

@keyframes move2 {
    from {
        border-radius: 0%;
        transform: translate(70%, -50%);
    }
    to {
        border-radius: 100%;
        transform: translate(100%, -50%);
    }
}
#verification_code{
    border: #444;
    margin-left: 20px;
    margin-top: 10px;
    margin-right: 20px;
    border-radius: 5px;
    height: 40px;
    width: 100px;
    background-color:#eaeaea;
    text-indent: 25px;
    line-height: 1;
    font-weight: 600;
    font-size: 1.2rem;
    display: inline;
}
#code{
    display: inline-block;
    width: 80px;
    height: 30px;
    font-size: 18px;
    line-height: 30px;
    text-align: center;
    color: #333;
    border: 1px solid rgb(0, 0, 0);
}
#tishi{
    margin-top: 3px;
    color: #fa5b5b;
    font-size: 13px;
    line-height: 20px;
    vertical-align: top;
}
#yan{
    margin-top: 3px;
    color: #fa5b5b;
    font-size: 13px;
    line-height: 20px;
    vertical-align: top;
}
#load-button:hover{
    background-color: #2e6fe0;
}

.register-link {
  margin-top: 20px;
  text-align: center;
}

.register-link a {
  color: #5995fd;
  text-decoration: none;
  font-size: 14px;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
  

