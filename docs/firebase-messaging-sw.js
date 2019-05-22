self.addEventListener('push', ( event ) =>
{
	console.log( event, event.data.json() );
} );

importScripts( 'https://www.gstatic.com/firebasejs/6.0.2/firebase-app.js' );
importScripts( 'https://www.gstatic.com/firebasejs/6.0.2/firebase-messaging.js' );

firebase.initializeApp( { messagingSenderId: '120822794138' } );

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler( ( payload ) =>
{
	console.log( payload );
	const notificationTitle = payload.notification.title;
	const notificationOptions =
	{
		body: payload.notification.body,
	};
	return self.registration.showNotification( notificationTitle, notificationOptions );
} );
