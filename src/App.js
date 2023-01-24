import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "./App.css";
import styles from './components/dataStoring.module.css';

function App() {

  const [message, setMessage] = useState("");

  const { register, handleSubmit, onChange, formState: { errors } } = useForm({ mode: 'onChange', shouldUseNativeValidation: true, reValidateMode: 'onChange', });

  const handleOnlyNumber = (event) => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

  // useEffect(() => {
  //   fetch("http://localhost:8000/secondpage")
  //     .then((res) => res.json())
  //     .then((data) => setMessage(data.message));
  // }, []);

  const onSubmit = async (data) => {

    console.log("data16", data)
    const ans = await axios.post('http://localhost:8000/createData', { data: data })
  }

  return (
    <div className={styles.mainContainer}>
      <h1>{message}</h1>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>

        <div className={styles.formGroup}>
          <label htmlFor="name">name</label>
          <input type="text" name="name" className={styles.inputBox} placeholder="your name"  {...register("name")} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">e-mail id</label>
          <input type="text" name="email" className={styles.inputBox} placeholder="e-mail id"  {...register("email")} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone number">phone number*</label>
          <input type="tel" name="phoneNumber" onKeyPress={(event) => { handleOnlyNumber(event) }} className={`${styles.inputBox} ${errors.phone ? styles.isInValid : ''}`} placeholder="phone number*" {...register("phone", { required: true, minLength: 10, maxLength: 10, pattern: /^[0-9]+$/ })} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="pincode">pincode</label>
          <input type="tel" name="pincode" onKeyPress={(event) => { handleOnlyNumber(event) }} className={styles.inputBox} placeholder="6 digit pincode" {...register("pincode", { minLength: 6, maxLength: 6, pattern: /^(\d{4}|\d{6})$/ })} />
        </div>

        <div className={styles.requestCallButton} >
          <button type="submit">submit</button>
        </div>

      </form>
    </div>
  );
}

export default App