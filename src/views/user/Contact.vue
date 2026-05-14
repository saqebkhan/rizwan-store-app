<template>
  <div class="max-w-4xl mx-auto px-4 py-20">
    <div class="text-center mb-16">
      <h1 class="text-4xl font-bold mb-4">Get in Touch</h1>
      <p class="text-gray-500 text-lg">Have questions? We're here to help.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100">
      <div class="space-y-8">
        <div class="flex items-start space-x-4">
          <div class="w-12 h-12 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center shrink-0">
            <span class="material-icons">phone</span>
          </div>
          <div>
            <h3 class="font-bold">Call Us</h3>
            <p class="text-gray-500">+91 98765 43210</p>
          </div>
        </div>
        <div class="flex items-start space-x-4">
          <div class="w-12 h-12 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center shrink-0">
            <span class="material-icons">email</span>
          </div>
          <div>
            <h3 class="font-bold">Email Support</h3>
            <p class="text-gray-500">support@rizwanstore.com</p>
          </div>
        </div>
      </div>
      <form class="space-y-4">
        <input type="text" placeholder="Name" class="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-primary-500" />
        <input type="email" placeholder="Email" class="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-primary-500" />
        <textarea placeholder="Message" rows="4" class="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-primary-500"></textarea>
        <button class="w-full bg-primary-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-primary-700 transition">Send Message</button>
      </form>
    </div>
  </div>
</template>
