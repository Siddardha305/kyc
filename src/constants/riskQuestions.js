export const riskQuestions = [
  { type: 'radio', group: 'About You', id: 'age', text: 'What is your age group?', options: ['< 40','40-50','51-60','> 60'] },
  { type: 'radio', group: 'Your Finances', id: 'income', text: 'Approx annual income?', options: ['< 10L','10-50L','50L-1Cr','> 1Cr'] },
  { type: 'radio', group: 'Your Finances', id: 'invest_percent', text: 'Portion of income you invest?', options: ['< 20%','20-50%','> 50%'] },
  { type: 'radio', group: 'Your Finances', id: 'liability_percent', text: 'Income to liabilities?', options: ['< 20%','20-50%','> 50%'] },
  { type: 'radio', group: 'Your Goals', id: 'outcome', text: 'Ideal 1yr outcome?', options: ['Capital Protection','Average Returns','High Returns'] },
  { type: 'checkbox', group: 'Your Goals', id: 'current_investments', text: 'Select all you currently hold', options: ['Bank FD','Mutual Funds','Stocks'] },
  { type: 'select', group: 'Your Goals', id: 'objective', text: 'Investment objective', options: [
    { text: 'Protect capital (very low loss)', horizon: '< 2 years' },
    { text: 'Balance growth & protection', horizon: '2-5 years' },
    { text: 'Long-term wealth (higher ST loss)', horizon: '> 5 years' },
  ]},
]
