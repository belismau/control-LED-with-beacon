var messageOutput = document.querySelector(".message");
var currentTopics = document.querySelector(".currentTopic");
var lampStatus = document.querySelector("#lampStatus");

const sentMessage = () => {
  fetch("http://localhost:8080/api/send", {
      headers: { "Content-Type": "application/json" }
    })
    .then((response) => response)
    .catch((err) => {
      console.log(err);
    });
};

const fetchMessage = () => {
  fetch("http://localhost:8080/api/messages")
    .then((response) => response.json())
    .then((data) => {
      currentTopics.innerHTML = `${data.topic}`;
      messageOutput.innerHTML = `${data.msg}`;
      if (data.msg == 'ON') {
        lampStatus.className = 'alert alert-success animate__animated animate__fadeInDown'
        lampStatus.firstElementChild.firstChild.textContent = 'Someone is near the sensor! '
        lampStatus.firstElementChild.children[0].innerHTML = '💡 Lights ON'
      } else if (data.msg == 'OFF') {
        lampStatus.className = 'alert alert-warning animate__animated animate__fadeInDown'
        lampStatus.firstElementChild.firstChild.textContent = 'No one is in the proximity of the sensor '
        lampStatus.firstElementChild.children[0].innerHTML = '💡 Lights OFF'
      } else {
        // If message received is not ON or OFF
        lampStatus.className = 'alert alert-danger animate__animated animate__fadeInDown'
        lampStatus.firstElementChild.firstChild.textContent = 'Something went wrong '
        lampStatus.firstElementChild.children[0].innerHTML = 'Light status UNKNOWN'
      }
    })
    .catch((err) => {
      console.log(err);
    });
    return true
};