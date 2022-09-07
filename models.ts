/*
 *  This file containes interfaces that represent the content of the
 *  webhook request's body. I won't be using all of these but figured
 *  someone might find this useful one day <3ß  
 *  
 *  Copyright (C) 2022  Joseph Diragi
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.  
*/

export interface Webhook {
    id: string
    name: string
    url: string
}

export interface App {
    id: string
    type: string
}

export interface Workflow {
    id: string
    type: string
    attributes: {
        name: string
        description: string
        lastModifiedDate: string
        isEnabled: boolean
        isLockedForEditing: boolean
    }
}

export interface Product {
    id: string
    type: string
    attributes: {
        name: string
        createdDate: string
        productType: string
    }
}

export interface BuildRun {
    id: string
    type: string
    attributes: {
        number: number
        createdDate: string
        startedDate: string
        finishedDate: string
        sourceCommit: {
            commitSha: string
            author: {
                displayName: string
            }
            commiter: {
                displayName: string
            }
            htmlUrl: string
        }
        isPullRequestBuild: boolean
        executionProgress: string
        completionStatus: string
    }
}

export interface BuildAction {
    id: string
    type: string
    attributes: {
        name: string
        actionType: string
        startedDate: string
        finishedDate: string
        issueCounts: {
            analyzerWarnings: number
            errors: number
            testFailures: number
            warnings: number
        }
        executionProgress: string
        completionStatus: string
        isRequiredToPass: boolean
    }
    relationships: {} // Need more data
}

export interface ScmProvider {
    type: string
    attributes: {
        scmProviderType: {
            scmProviderType: string
            displayName: string
            isOnPremise: boolean
        }
        endpoint: string
    }
}

export interface ScmRepository {
    id: string
    type: string
    attributes: {
        httpCloneUrl: string
        sshCloneUrl: string
        ownerName: string
        repositoryName: string
    }
}

export interface ScmGitReference {
    id: string
    type: string
    attributes: {
        name: string
        canonicalName: string
        isDeleted: boolean
        kind: string
    }
}

export interface XcodeCloudRequest {
    webhook: Webhook
    app: App
    ciWorkflow: Workflow
    ciProduct: Product
    ciBuildRun: BuildRun
    ciBuildActions: [BuildAction]
    scmProvider: ScmProvider
    scmRepository: ScmRepository
    scmGitReference: ScmGitReference
}