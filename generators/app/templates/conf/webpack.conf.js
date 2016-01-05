  module: {
    preLoaders: [
      {
<% if (framework === 'react') { -%>
        test: /\.tsx$/,
<% } else { -%>
        test: /\.ts$/,
<% } -%>
        exclude: /node_modules/,
        loader: 'tslint'
      }
    ],
