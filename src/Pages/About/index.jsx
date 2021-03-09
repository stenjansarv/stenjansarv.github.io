import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import moment from 'moment'
import { get } from 'lodash'

import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

import { ExperimentOutlined, BankOutlined } from '@ant-design/icons';

// Components
import NavigationBar from '../../components/NavigationBar'
import LoadingScreen from '../../components/Loading'

// Actions
import { fetchEmployments } from '../../redux/actions/employments.actions'
import { fetchEducations } from '../../redux/actions/educations.actions'
import { selectResearcher } from '../../redux/actions/auth.actions'

// Styles
const Container = styled.div`
  background: rgb(0,3,22);
  display: flex;
  flex-direction: column;
  height: 100vh;
`
const Content = styled.div`
  align-items: center;
`

const About = () => {
  const dispatch = useDispatch()

  const { orcidId } = useParams()

  // MapStateToProps
  const employments = useSelector(state => state.employments.list)
  const educations = useSelector(state => state.educations.list)
  const isLoadingEmployments = useSelector(state => get(state.waiting.list, 'EMPLOYMENTS', true))
  const isLoadingEducations = useSelector(state => get(state.waiting.list, 'EDUCATIONS', true))

  // Actions
  const loadEmployments = (publisherId) => dispatch(fetchEmployments(publisherId))
  const loadEducations = (publisherId) => dispatch(fetchEducations(publisherId))
  const setResearcher = (orcidId) => dispatch(selectResearcher(orcidId))

  useEffect(() => {
    loadEmployments(orcidId)
    loadEducations(orcidId)
    setResearcher(orcidId)
  }, [])

  if (isLoadingEmployments || isLoadingEducations) {
    return (
      <LoadingScreen />
    )
  }
  
  return (
    <Container>
      <NavigationBar />
      <Content>
      <h1 style={{color: 'white'}}>Education & Employment History</h1>
      <VerticalTimeline>
      {employments.concat(educations).sort((a, b) => ((a.start_date ? a.start_date : a.end_date) > (b.start_date ? b.start_date : b.end_date)) ? 1 : -1).map((career, key) => {
        return (<VerticalTimelineElement
          contentStyle={{ backgroundColor: '#C4C3E9', color: '#fff'}}
          contentArrowStyle={{ borderRight: '7px solid #C4C3E9' }}
          key={key}
          iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff', display: 'flex', justifyContent: 'center' }}
          icon={career.education_id ? <ExperimentOutlined /> : <BankOutlined />}
        >
          <h4 style={{textAlign: key % 2 === 0 ? 'left' : 'right', fontSize: '20px'}}>{career.start_date ? moment(career.start_date).format("DD MMM YYYY") : moment(career.end_date).format("DD MMM YYYY")}</h4>
          <h3 className="vertical-timeline-element-title">{career.role_title}</h3>
          <h4 className="vertical-timeline-element-subtitle">{career.organization_name} ({career.organization_address})</h4>
        </VerticalTimelineElement>)})}
        </VerticalTimeline>
      </Content>
    </Container>
  )
}

export default About