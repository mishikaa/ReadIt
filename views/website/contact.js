const sendMail = () => {
    console.log("clicked")   
    const params = {
            from_name: document.getElementById("name").value,
            email_id: document.getElementById("email").value,
            message: document.getElementById("message").value
       }

       const service_id="service_m2hq92b";
       const template_id="template_4ui6aga";

        emailjs.send(service_id, template_id, 
        params)
        .then(function(response) {
            document.getElementById("name").value = "",
            document.getElementById("email").value = "",
            document.getElementById("message").value = ""
            
            req.flash('success', 'Sent!')
	        console.log('SUCCESS!', response.status, response.text);
	}, function(err) {
        req.flash('error', 'Something went wrong!')

	   console.log('FAILED...', err);
	});
} 

module.exports = sendMail;