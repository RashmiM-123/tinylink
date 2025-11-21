import React, { useState } from 'react'

const Dashboard = () => {
    const[longUrl,setLongUrl]=useState('')
    const[creating,setCreating]=useState(false)
    const handleLongUrl=(e:any)=>{
        setLongUrl(e.target.value)
    }
  return (
    <div>
        <h1>Url Shortener Dashboard</h1>
        <div>
            <form>
                <label>Long URL</label>
                <input value={longUrl} onChange={handleLongUrl} />
                <label>Custom Code</label>
                <input />
                <button>{creating ? "Creating..." : "Create"}</button>
            </form>
        </div>
        {/* filter */}
        <input />
        <div>
            <table>
                <thead>
                    <tr>
                        <th>short Code</th>
                        <th>Target URL</th>
                        <th>Total Clicks</th>
                        <th>Last Clicked</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>short url</td>
                            <td>target</td>
                            <td>clicks</td>
                            <td>last_clicked</td>
                            <td><button>copy</button>
                            <button>Delete</button>
                            <button>View</button>
                            </td>

                        </tr>
                    </tbody>
                
            </table>
        </div>

    </div>
  )
}

export default Dashboard