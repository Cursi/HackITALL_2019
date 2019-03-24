
//activates when receiving a push notification
self.addEventListener("push", e => {
  const data = e.data.json();
  console.log("Push Receieved...");
  console.log(data);
  self.registration.showNotification(data.title, {
    body: data.content,
    icon: "https://banner2.kisspng.com/20171217/8a2/envelope-png-5a3744625f6bf9.6827994515135714263909.jpg",
    tag: data.place_id,
    data: data.content,
    actions: [
      { action: 'later', title: 'Niice' }
    ]
  });
});

self.addEventListener('notificationclick', e => {
  console.log('Notification clicked!');
  e.notification.close();
})
