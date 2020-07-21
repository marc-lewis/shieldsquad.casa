<template>
  <main>
    <div class="logo">
      <img
        :src="content.logo.fields.file.url"
        alt="content.logo.fields.title"
      >
    </div>
    <h2 class="description">
      {{ getRandomDescription() }}
    </h2>
    <nav>
      <nuxt-link to="/standup">
        Standup
      </nuxt-link>
    </nav>
  </main>
</template>

<script>
import { createClient } from '~/plugins/contentful.js'
const client = createClient()

export default {
  asyncData ({ env }) {
    return Promise.all([
      client.getEntries({
        'sys.id': env.CTF_HOMEPAGE_ID
      })
    ]).then(([entries]) => {
      return {
        content: entries.items[0].fields
      }
    }).catch(console.error)
  },
  methods: {
    getRandomDescription () {
      const numberOfDescriptions = this.content.description.length
      const randomNumber = Math.round(Math.random() * (numberOfDescriptions - 1))
      return this.content.description[randomNumber]
    }
  }
}
</script>
