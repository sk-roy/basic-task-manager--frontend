<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <div class="wrapper">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <RouterLink class="navbar-brand" to="/">Task Manager</RouterLink>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <RouterLink class="nav-link active" aria-current="page" to="/"
                  >Home</RouterLink
                >
              </li>
              <li class="nav-item">
                <RouterLink
                  class="nav-link active"
                  aria-current="page"
                  to="/about"
                  >About</RouterLink
                >
              </li>
              <li class="nav-item">
                <RouterLink
                  class="nav-link active"
                  aria-current="page"
                  to="/newtask"
                  >New Task</RouterLink
                >
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </header>

  <RouterView />
</template>
