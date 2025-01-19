const messageTextArea = document.getElementById("messageTextArea");
const messageSendBtn = document.getElementById("messageSendBtn");
const chatBoxBody = document.getElementById("chatBoxBody");
const uiGroup = document.getElementById("groups");
const groupNameHeading = document.getElementById("groupNameHeading");
const socket = io("http://localhost:5000");

socket.on("data", function (data) {
  console.log(data);
});

function clearChatBox() {
  chatBoxBody.innerHTML = "";
  localStorage.setItem("chats", JSON.stringify([]));
  groupNameHeading.innerHTML = "";
}

function setActiveGroup(li) {
  const activeLi = document.getElementsByClassName("active");
  if (activeLi.length !== 0) {
    activeLi[0].classList.remove("active");
  }
  li.classList.add("active");
}

function updateGroupName(groupName) {
  localStorage.setItem("groupName", groupName);
  var span = document.createElement("span");
  span.appendChild(document.createTextNode(groupName));
  groupNameHeading.appendChild(span);
}

function activeGroup(e) {
  clearChatBox();
  var li = e.target;
  while (li.tagName !== "LI") {
    li = li.parentElement;
  }
  setActiveGroup(li);
  var groupName = li.querySelector("span").textContent;
  updateGroupName(groupName);
  getMessages();
}

function scrollToBottom() {
  chatBoxBody.scrollTop = chatBoxBody.scrollHeight;
}

function clearGroupMembers() {
  var members = chatBoxBody.querySelectorAll(".groupMembersDiv");
  members.forEach(function (member) {
    member.remove();
  });
}

async function messageSend() {
  try {
    clearGroupMembers();
    var message = messageTextArea.value;
    var token = localStorage.getItem("token");
    var groupName = localStorage.getItem("groupName");
    if (!groupName) {
      return alert("Select a group to send the message");
    }

    // Add a timestamp
    var time = new Date().toLocaleTimeString();

    var res = await axios.post(
      "http://localhost:4000/chat/sendMessage/",
      { message: message, groupName: groupName, time: time },
      { headers: { Authorization: token } }
    );
    messageTextArea.value = "";
    getMessages();
    scrollToBottom();
  } catch (error) {
    console.log("Something went wrong:", error);
  }
}

function decodeToken(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

function getMessages() {
  var token = localStorage.getItem("token");
  var decodedToken = decodeToken(token);
  var userId = decodedToken.userId;
  var groupName = localStorage.getItem("groupName");

  socket.emit("getMessages", groupName);
  socket.on("messages", function (messages) {
    chatBoxBody.innerHTML = "";
    messages.forEach(function (message) {
      var div = document.createElement("div");
      chatBoxBody.appendChild(div);

      var messageSendBy = document.createElement("span");
      messageSendBy.className =
        "d-flex " +
        (message.userId == userId
          ? "justify-content-end"
          : "justify-content-start") +
        " px-3 mb-1 text-uppercase small text-white";
      messageSendBy.appendChild(
        document.createTextNode(message.userId == userId ? "You" : message.name)
      );
      div.appendChild(messageSendBy);

      var messageBox = document.createElement("div");
      var messageText = document.createElement("div");
      var messageTime = document.createElement("span");

      messageBox.className =
        "d-flex " +
        (message.userId == userId
          ? "justify-content-end"
          : "justify-content-start") +
        " mb-4";

      messageText.className =
        message.userId == userId ? "msg_cotainer_send" : "msg_cotainer";
      messageText.appendChild(document.createTextNode(message.message));

      // Format the timestamp to local time
      var messageDate = new Date(message.time); // Convert ISO string to Date object
      var hours = messageDate.getHours();
      var minutes = messageDate.getMinutes();
      var ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12; // Convert to 12-hour format
      hours = hours ? hours : 12; // If hours is 0, set to 12
      minutes = minutes < 10 ? "0" + minutes : minutes; // Add leading zero to minutes
      var formattedTime = `${hours}:${minutes} ${ampm}`;

      messageTime.className =
        message.userId == userId ? "msg_time_send" : "msg_time";
      messageTime.appendChild(document.createTextNode(formattedTime));

      messageText.appendChild(messageTime);
      messageBox.appendChild(messageText);
      div.appendChild(messageBox);
    });

    scrollToBottom();
  });
}

function sendMedia() {
  axios
    .post("http://localhost:4000/upload", { headers: { Authorization: token } })
    .then((res) => {
      console.log(res.data.fileURL);
    })
    .catch((err) => {
      console.log(err);
    });
}

messageSendBtn.addEventListener("click", messageSend);
uiGroup.addEventListener("click", activeGroup);
document.addEventListener("DOMContentLoaded", function () {
  localStorage.setItem("groupName", "");
  localStorage.setItem("chats", JSON.stringify([]));
});
