const SendPosts = () => {
    const inputChangeHandler = () => {

    }

    const submitHandle = () => {

    }
  return (
    <>
        <div className='send-container'>
            <div>
                <input
                    type='text'
                    placeholder='title: ...'
                    onChange={inputChangeHandler}
                />
            </div>
            <div>
                <textarea
                    type='text'
                    placeholder='descriptions'
                    onChange={inputChangeHandler}
                />
            </div>
            <div>
                <button className='submit-button' onClick={submitHandle} />
            </div>
        </div>
    </>
  );
};

export default SendPosts;