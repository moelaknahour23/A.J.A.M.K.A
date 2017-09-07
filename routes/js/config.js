config = { 
	siteURL: "http://yoursite.com/contact", // Your website - this should be to the page that submitted the form. If it is the root (yoursite.com) please include a / on the end.
	AWSAccessKeyID: "YourAWSConfig", // AWS Access Key ID - Reccomended you use IAM users.
	AWSSecretKey: "YourAWSKey", // AWS Secret Key for above.
	SESFrom: "trusted@email.com",  // Trusted email that should be sent from.
	emailTo: "yourinbox@yourdomain.com", // Trusted email who it should be sent to.

	// Optional - You don't need to change the following for the app to work.
	normalPort: 1407, // The port the contact form runs on.
	noJSPort: 1408 // This cannot be the same as normalPort.
}