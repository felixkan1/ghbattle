import React from 'react'
import PropTypes from 'prop-types';
import { fetchPopularRepos } from '../utils/api'
import { FaUser, FaStar, FaCodeBranch, FaExclamationTriangle } from 
'react-icons/fa' 
import Card from './Card'
import Loading from './Loading'
import Tooltip from './Tooltip'


function LanguagesNav({ selected, onUpdateLanguage}) {
  const languages = ['All', 'Javascript', 'Ruby', 'CSS', 'Python']

  return (  
    <ul className="flex-center">
      {languages.map((language) => (
        <li key={language}>
          <button
            className="btn-clear nav-link"
            style={language === selected ? {color:'red'}: null}
            onClick={() => onUpdateLanguage(language)}>
              {language}
            </button>
        </li>
      ))}
    </ul>

  )
}


LanguagesNav.propTypes = {
  selected: PropTypes.string.isRequired,
  onUpdateLanguage: PropTypes.func.isRequired
}

function ReposGrid ({ repos }) {
  return (
    <ul className='grid space-around'> 
      {repos.map((repo, index)=>{
        const { name, owner, html_url, stargazers_count, forks, open_issues} = repo
        const { login, avatar_url } = owner

        return (
          <li key={html_url}>
            <Card
              header={`#${index + 1}`}
              avatar={avatar_url}
              href={html_url}
              name={login}
            >
              <ul className='card-list'>
                <li>
                  <Tooltip text="Github username">
                    <FaUser color='rgb(255, 191, 116)' size={22} />
                    <a href={`https://github.com/${login}`}>
                      {login}
                    </a>
                  </Tooltip>
                </li>
                <li>
                  <Tooltip text="Start Gazers Count">
                    <FaStar color='rgb(255, 215, 0)' size={22} />
                    {stargazers_count.toLocaleString()} stars
                  </Tooltip>
                </li>
                <li>
                  <Tooltip text="Forks">
                    <FaCodeBranch color='rgb(129, 195, 245)' size={22} />
                    {forks.toLocaleString()} forks
                  </Tooltip>
                </li>
                <li>
                  <Tooltip text="Open Issues">
                    <FaExclamationTriangle color='rgb(241, 138, 147)' size={22} />
                    {open_issues.toLocaleString()} open
                  </Tooltip>
                </li>
              </ul>
            </Card>
          </li>
        )
      })}
    </ul>  
  )
  
}

ReposGrid.propTypes = {
  repos: PropTypes.array.isRequired
}


export default class Popular extends React.Component{

  
  state = {
    selectedLanguage: 'All',
    repos: {},
    error: null
  }
  componentDidMount(){
    this.updateLanguage(this.state.selectedLanguage)
  }

  updateLanguage = (selectedLanguage) => {
    this.setState({
      selectedLanguage,
      //loading screen when error or repo is null
      error: null,
    })
    if(!this.state.repos[selectedLanguage]){
      fetchPopularRepos(selectedLanguage)
        .then((data) => {
          this.setState(({ repos }) => ({ //{repos} is current state, used destructuring
            repos: {
              ...repos, //current repos state
              [selectedLanguage]: data //merge with this new object
            }
          }))
        })
        .catch((error) => {
          console.warn("Error fetching repos", error)
  
          this.setState({
            error: 'there was an error fetching the repository'
          })
        })
    }

  }

  isLoading = () => {
    const { selectedLanguage, repos, error } = this.state
    //no erorr and selected language not loaded
    return !repos[selectedLanguage] && error === null
  }
   
  render(){

    const { selectedLanguage, repos, error } = this.state;

    return(
      <React.Fragment>
        <LanguagesNav
          selected={selectedLanguage}
          onUpdateLanguage={this.updateLanguage}
        />


        {this.isLoading() && <Loading text='Loading' speed ={100}/>}

        {error && <p className='center-text-'>{error}</p>}

        {repos[selectedLanguage] && <ReposGrid repos={repos[selectedLanguage]} />}
      </React.Fragment>
    )
  }
}