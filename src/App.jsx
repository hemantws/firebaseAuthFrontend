import { useState } from "react";
import auth from "./config/firebase-config";
import {
  getAuth,
  getIdToken,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import axios from "axios";

function App() {
  const [token, setToken] = useState("");
  const [sign, setSign] = useState("");
  let email = "newadmin@billione.com",
    password = "Websoham@123";
  // const auth = getAuth();

  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCred) => {
        console.log(userCred);
        const auth = getAuth();
        const user = auth.currentUser;
        user
          .getIdToken(true)
          .then(async (idToken) => {
            console.log(idToken);
            try {
              console.log(
                await axios.get("http://localhost:5000/", {
                  headers: {
                    Authorization: `Bearer ${idToken}`,
                  },
                })
              );
            } catch (error) {
              console.log(error);
            }
          })
          .catch((err) => {
            console.log(err);
          });
        setSign("Signed In");
      })
      .catch((err) => {
        console.log(err);
      });

    // signInWithEmailAndPassword(auth, email, password)
    //   .then(async (userCred) => {
    //     const token = userCred.user.accessToken;
    //     console.log(userCred);
    //     try {
    //       console.log(
    //         await axios.get("http://localhost:5000/", {
    //           headers: {
    //             Authorization: `Bearer +${token}`,
    //           },
    //         })
    //       );
    //     } catch (error) {
    //       console.log(error.message);
    //     }
    //     setSign("Signed In");
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  const signUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCred) => {
        console.log(userCred.user.accessToken);
        await axios.get("http://localhost:5000/", {
          headers: {
            Authorization: `Bearer ${userCred.user.accessToken}`,
          },
        });
        setToken("token generated");
      })
      .catch();
  };

  return (
    <>
      {token ? <h1>{token}</h1> : <button onClick={signUp}>Sign Up</button>}
      <br></br>
      {sign ? <h1>{sign}</h1> : <button onClick={signIn}>Sign In</button>}
    </>
  );
}

export default App;
