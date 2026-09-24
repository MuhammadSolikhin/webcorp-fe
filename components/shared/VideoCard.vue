<template>
    <a :href="link" class="video-card">
      <div class="relative mb-7">
        <img class="relative object-contain z-10 w-full shadow-xl rounded-md" :src="image" :alt="title" />
      </div>
  
      <h1 class="font-semibold text-lg text-black mt-2">{{ title }}</h1>
      <!-- <div class="mt-2 flex flex-wrap items-center">
        <div class="mr-3">
          <div class="flex items-center">
            <div
              class="star-ratings items-center"
              :title="`${stars} Stars`"
              style="position: relative; box-sizing: border-box; display: inline-block;"
            >
              <span v-for="i in 5" :key="i" class="star-container">
                <i
                  :class="[
                    'fa-solid',
                    i <= stars ? 'fa-star text-yellow-400' : 'fa-star text-gray-400', // Gold for filled, grey for empty
                  ]"
                ></i>
              </span>
            </div>
          </div>
        </div>
  
        <div class="text-sm text-gray-400">
          Telah ditonton <strong class="text-gray-500">{{ views }}</strong> kali
        </div>
      </div> -->
  
      <div class="text-sm my-2">
        <p class="description">{{ description }}</p>
      </div>
    </a>
  </template>
  
  <script>
  export default {
    props: {
      title: String,
      image: String,
      description: String,
      views: Number,
      link: String,
      stars: {
        type: Number,
        default: 0, // Ensure default is 0 if not provided
      },
    },
  };
  </script>
  
  <style scoped>
  .video-card {
    display: block;
    text-decoration: none;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .video-card img {
    width: 100%;
    border-radius: 8px;
  }
  
  .video-card h1 {
    font-size: 18px;
    margin: 10px 0;
  }
  
  .star-ratings {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .star-container {
    margin-right: 2px;
  }
  
  .star-icon {
    font-size: 1.25rem; /* Adjust the size of the star */
  }
  
  .text-yellow-400 {
    color: #fbbf24; /* Gold color for filled stars */
  }
  
  .text-gray-400 {
    color: #d1d5db; /* Grey color for empty stars */
  }
  
  .description {
    font-size: 14px;
    color: #555;
  }
  
  .text-sm {
    font-size: 14px;
  }
  
  .mt-2 {
    margin-top: 8px;
  }
  
  .mb-7 {
    margin-bottom: 28px;
  }
  
  .font-semibold {
    font-weight: 600;
  }
  
  .text-lg {
    font-size: 1.125rem;
  }
  
  .w-full {
    width: 100%;
  }
  
  .rounded-md {
    border-radius: 6px;
  }
  
  .shadow-xl {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .text-gray-400 {
    color: #9ca3af;
  }
  
  .text-gray-500 {
    color: #6b7280;
  }
  </style>
  