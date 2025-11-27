/* form.js — placeholder for payment-first registration

  Intended flow (to implement later):
  1. User fills form (name, email, phone, course)
  2. User clicks "Register & Pay" button -> trigger payment popup (Paystack or Flutterwave)
  3. On successful payment callback:
      - POST registration data to your Formspree endpoint (or send to Zapier webhook)
      - Optionally store transaction reference + user details to Google Sheets via Zapier/Integromat
      - Redirect user to thank-you.html?course=...
  4. On payment failure/cancel: show friendly message and allow retry

  Example integration (Paystack) will go here when you’re ready.
*/

/* Example helper to send to Formspree (uncomment and edit endpoint when used):
function sendRegistration(data) {
  return fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}
*/

document.getElementById('payButton').addEventListener('click', function(e) {
  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const school = document.getElementById('school').value;
  const department = document.getElementById('department').value;
  const level = document.getElementById('level').value;

  const selectedCourses = Array.from(document.querySelectorAll('input[name="course"]:checked')).map(cb => cb.value);

  if(!fullName || !email || !phone || !school || !department || selectedCourses.length === 0) {
    alert('Please fill in all required fields and select at least one course.');
    return;
  }

  let amount = 0;
  selectedCourses.forEach(course => {
    switch(course) {
      case 'physics':
      case 'chemistry':
      case 'mathematics':
        amount += 35000 * 100;
        break;
      case 'all':
        amount += 90000 * 100;
        break;
    }
  });

  const coursesString = selectedCourses.join(", ");

  let handler = PaystackPop.setup({
    key: 'pk_test_581e525c53984527bc18fb880a6a91644775f70e',
    email: email,
    amount: amount,
    currency: "NGN",
    ref: 'CCAcademy_'+Math.floor((Math.random() * 1000000000) + 1),
    
    title: "Core Concepts Academy",
    description: "Payment for selected course(s)",
    

    metadata: {
       custom_fields: [
          {display_name: "Full Name", variable_name: "fullName", value: fullName},
          {display_name: "Phone", variable_name: "phone", value: phone},
          {display_name: "School", variable_name: "school", value: school},
          {display_name: "Department", variable_name: "department", value: department},
          {display_name: "Level", variable_name: "level", value: level},
          {display_name: "Course(s)", variable_name: "courses", value: coursesString}
       ]
    },
    callback: function(response){
        alert('Payment successful. Ref: ' + response.reference);
        window.location.href = "thank-you.html";
    },
    onClose: function(){
        alert('Payment window closed.');
    }
  });
  handler.openIframe();
});
