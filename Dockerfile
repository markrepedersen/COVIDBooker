FROM ubuntu:latest

# Install NodeJS, NPM, Chrome, Chromedriver
RUN apt-get -y update && \
	apt-get -y install curl unzip wget && \
	curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
	wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
	echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list && \
	apt-get -y update && \
	apt-get install -y nodejs google-chrome-stable

# Set up Chromedriver Environment variables
ENV CHROMEDRIVER_VERSION 84.0.4147.30
ENV CHROMEDRIVER_DIR /chromedriver
RUN mkdir $CHROMEDRIVER_DIR

# Download and install Chromedriver
RUN wget -q --continue -P $CHROMEDRIVER_DIR "http://chromedriver.storage.googleapis.com/$CHROMEDRIVER_VERSION/chromedriver_linux64.zip"
RUN unzip $CHROMEDRIVER_DIR/chromedriver* -d $CHROMEDRIVER_DIR

# Put Chromedriver into the PATH
ENV PATH $CHROMEDRIVER_DIR:$PATH

# Run NPM install first to enable layer caching in case of future changes
COPY ./package.json .
RUN npm install

# Copy source files to build
COPY . .

# Run the process
ENTRYPOINT npm run book
