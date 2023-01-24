// import React from "react"
// import styles from './dataStoring.module.css'
// import { useForm } from "react-hook-form";


// const DataStored = () => {

//     const { register, handleSubmit, watch, reset, onChange, formState: { errors } } = useForm({ mode: 'onChange', shouldUseNativeValidation: true, reValidateMode: 'onChange', });

//     const onSubmit = (data) => {

//         console.log("data9",data)
//     }

//     return (
//         <>
//             <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>

//                 <div className={styles.formGroup}>
//                     <label htmlFor="name">name</label>
//                     <input type="text" name="name" className={styles.inputBox} placeholder="your name"  {...register("name")} />
//                 </div>

//                 <div className={styles.formGroup}>
//                     <label htmlFor="email">e-mail id</label>
//                     <input type="text" name="email" className={styles.inputBox} placeholder="e-mail id"  {...register("email")} />
//                 </div>
//             </form>
//         </>
//     )
// }

// export default DataStored;